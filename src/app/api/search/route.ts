import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");
        const type = searchParams.get("type") || "courses";

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        if (type === "courses") {
            // Search courses
            const courses = await prisma.course.findMany({
                where: {
                    published: true,
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                        { category: { contains: query, mode: "insensitive" } },
                    ],
                },
                include: {
                    instructor: {
                        select: { name: true },
                    },
                },
                take: 20,
            });

            return NextResponse.json({ results: courses });
        } else if (type === "people") {
            // Search users
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } },
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
                take: 20,
            });

            return NextResponse.json({ results: users });
        }

        return NextResponse.json({ results: [] });
    } catch (error) {
        console.error("[SEARCH_ERROR]", error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
