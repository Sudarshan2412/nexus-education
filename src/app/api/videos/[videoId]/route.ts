import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { videoId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { videoId } = params;

        const video = await prisma.video.findUnique({
            where: {
                id: videoId,
            },
        });

        if (!video) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: video.courseId,
                instructorId: session.user.id,
            },
        });

        if (!courseOwner && session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.video.delete({
            where: {
                id: videoId,
            },
        });

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        console.log("[VIDEO_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { videoId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { videoId } = params;
        const values = await req.json();

        const video = await prisma.video.findUnique({
            where: {
                id: videoId,
            },
        });

        if (!video) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: video.courseId,
                instructorId: session.user.id,
            },
        });

        if (!courseOwner && session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedVideo = await prisma.video.update({
            where: {
                id: videoId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(updatedVideo);
    } catch (error) {
        console.log("[VIDEO_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
