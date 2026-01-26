import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { bountyId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bountyId = params.bountyId;
    const body = await req.json();
    const courseId = body?.courseId as string | undefined;

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const bounty = await prisma.bounty.findUnique({
      where: { id: bountyId },
    });

    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    if (bounty.status !== "OPEN") {
      return NextResponse.json({ error: "Bounty is already closed" }, { status: 400 });
    }

    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId: session.user.id, published: true },
      select: { id: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course must be published and owned by you" }, { status: 400 });
    }

    const posterHasCourse = await prisma.enrollment.findFirst({
      where: { userId: bounty.createdById, courseId },
    });

    if (posterHasCourse) {
      return NextResponse.json({ error: "Poster already has this course" }, { status: 400 });
    }

    try {
      await prisma.$transaction(async (tx) => {
        const updated = await tx.bounty.update({
          where: { id: bountyId, status: "OPEN" },
          data: {
            status: "CLOSED",
            fulfilledById: session.user.id,
            fulfilledCourseId: courseId,
          },
        });

        await tx.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: bounty.createdById,
              courseId,
            },
          },
          update: {},
          create: {
            userId: bounty.createdById,
            courseId,
          },
        });

        await tx.user.update({
          where: { id: session.user.id },
          data: { credits: { increment: updated.amount } },
        });

        await tx.bountyNotification.create({
          data: {
            userId: bounty.createdById,
            bountyId: bounty.id,
          },
        });
      });
    } catch (err) {
      return NextResponse.json({ error: "Bounty may have just closed" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[BOUNTY_FULFILL]", error);
    return NextResponse.json({ error: "Failed to fulfill bounty" }, { status: 500 });
  }
}
