import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const level = searchParams.get("level");

        const courses = await prisma.course.findMany({
            where: {
                published: true,
                ...(category && category !== "All" && { category }),
                ...(level && level !== "All" && { level: level as any }),
            },
            include: {
                instructor: {
                    select: { name: true, image: true }
                },
                // @ts-ignore
                reviews: {
                    select: { rating: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formattedCourses = courses.map((course: any) => {
            const hasReviews = course.reviews && Array.isArray(course.reviews);
            const avgRating = hasReviews && course.reviews.length > 0
                ? course.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / course.reviews.length
                : 0;

            return {
                ...course,
                avgRating,
                totalReviews: hasReviews ? course.reviews.length : 0
            };
        });

        return NextResponse.json(formattedCourses);
    } catch (error) {
        console.error("[COURSES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { title } = await req.json();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        const course = await prisma.course.create({
            data: {
                title,
                description: "",
                instructorId: session.user.id,
                published: false,
                category: "General", // Default value
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error("[COURSES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
