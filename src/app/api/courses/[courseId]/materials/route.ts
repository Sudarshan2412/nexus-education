import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = params;

        const materials = await prisma.material.findMany({
            where: {
                courseId: courseId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(materials);
    } catch (error) {
        console.log("[MATERIALS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = params;
        const { title, url, type, size } = await req.json();

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: session.user.id,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const material = await prisma.material.create({
            data: {
                title,
                url,
                type,
                size,
                courseId,
            },
        });

        return NextResponse.json(material);
    } catch (error) {
        console.log("[MATERIALS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
