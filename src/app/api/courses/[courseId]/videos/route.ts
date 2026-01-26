import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const { title, url, duration } = await req.json();

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                instructorId: session.user.id,
            },
        });

        if (!courseOwner && session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get the last video order
        const lastVideo = await prisma.video.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                order: "desc",
            },
        });

        const newPosition = lastVideo ? lastVideo.order + 1 : 1;

        const video = await prisma.video.create({
            data: {
                title,
                url,
                duration: duration || 0,
                courseId: params.courseId,
                order: newPosition,
            },
        });

        return NextResponse.json(video);
    } catch (error) {
        console.error("[VIDEOS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
