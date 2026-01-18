import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

        // 1. Check enrollment and progress
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId,
                },
            },
            include: {
                course: true,
                user: true,
            },
        });

        if (!enrollment) {
            return new NextResponse("Not enrolled", { status: 403 });
        }

        if (enrollment.progress < 100) {
            return new NextResponse("Course not completed", { status: 403 });
        }

        // 2. Issue or get existing certificate
        // @ts-ignore
        const certificate = await prisma.certificate.upsert({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId,
                },
            },
            update: {},
            create: {
                userId: session.user.id,
                courseId: courseId,
                certificateUrl: `/certificates/${session.user.id}-${courseId}`, // Placeholder
            },
        });

        return NextResponse.json({
            id: certificate.id,
            userName: enrollment.user.name,
            courseName: enrollment.course.title,
            issuedAt: certificate.issuedAt,
        });
    } catch (error) {
        console.log("[CERTIFICATE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
