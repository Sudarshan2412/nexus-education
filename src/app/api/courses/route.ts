import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { title } = await req.json();

        if (!session || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
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
        console.error("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
