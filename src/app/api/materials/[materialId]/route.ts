import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { materialId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { materialId } = params;

        const material = await prisma.material.findUnique({
            where: {
                id: materialId,
            },
        });

        if (!material) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: material.courseId,
                instructorId: session.user.id,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.material.delete({
            where: {
                id: materialId,
            },
        });

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        console.log("[MATERIAL_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
