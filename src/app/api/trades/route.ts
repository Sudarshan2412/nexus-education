import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TradeStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const summary = searchParams.get("summary");

    if (summary === "1") {
      const [incomingCount, outgoingCount] = await prisma.$transaction([
        prisma.courseTrade.count({
          where: { recipientId: session.user.id, status: TradeStatus.PENDING },
        }),
        prisma.courseTrade.count({
          where: { requesterId: session.user.id, status: TradeStatus.PENDING },
        }),
      ]);

      return NextResponse.json({ incomingCount, outgoingCount });
    }

    const [incoming, outgoing] = await prisma.$transaction([
      prisma.courseTrade.findMany({
        where: { recipientId: session.user.id },
        include: {
          requester: { select: { name: true, email: true } },
          requesterCourse: { select: { id: true, title: true, price: true, published: true } },
          recipientCourse: { select: { id: true, title: true, price: true, published: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.courseTrade.findMany({
        where: { requesterId: session.user.id },
        include: {
          recipient: { select: { name: true, email: true } },
          requesterCourse: { select: { id: true, title: true, price: true, published: true } },
          recipientCourse: { select: { id: true, title: true, price: true, published: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ incoming, outgoing });
  } catch (error) {
    console.error("[TRADES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch trades" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetCourseId, offeredCourseId } = await req.json();

    if (!targetCourseId || !offeredCourseId) {
      return NextResponse.json({ error: "Missing course selection" }, { status: 400 });
    }

    if (targetCourseId === offeredCourseId) {
      return NextResponse.json({ error: "Cannot trade the same course" }, { status: 400 });
    }

    const [offeredCourse, targetCourse] = await prisma.$transaction([
      prisma.course.findUnique({
        where: { id: offeredCourseId },
        select: { id: true, instructorId: true, published: true, price: true, title: true },
      }),
      prisma.course.findUnique({
        where: { id: targetCourseId },
        select: { id: true, instructorId: true, published: true, price: true, title: true },
      }),
    ]);

    if (!offeredCourse || !targetCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (offeredCourse.instructorId !== session.user.id) {
      return NextResponse.json({ error: "You can only trade courses you own" }, { status: 403 });
    }

    if (!offeredCourse.published || offeredCourse.price !== 50) {
      return NextResponse.json({ error: "Your offered course must be published and cost 50 credits" }, { status: 400 });
    }

    if (!targetCourse.published || targetCourse.price !== 50) {
      return NextResponse.json({ error: "Target course must be a published 50-credit course" }, { status: 400 });
    }

    if (targetCourse.instructorId === session.user.id) {
      return NextResponse.json({ error: "You already own this course" }, { status: 400 });
    }

    // Avoid duplicates/pending duplicates
    const existingPending = await prisma.courseTrade.findFirst({
      where: {
        requesterId: session.user.id,
        recipientId: targetCourse.instructorId,
        requesterCourseId: offeredCourseId,
        recipientCourseId: targetCourseId,
        status: TradeStatus.PENDING,
      },
    });

    if (existingPending) {
      return NextResponse.json({ error: "A pending trade already exists" }, { status: 400 });
    }

    // Ensure requester does not already have access to target course
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: targetCourseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "You already have access to this course" }, { status: 400 });
    }

    const trade = await prisma.courseTrade.create({
      data: {
        requesterId: session.user.id,
        requesterCourseId: offeredCourseId,
        recipientId: targetCourse.instructorId,
        recipientCourseId: targetCourseId,
        status: TradeStatus.PENDING,
      },
    });

    return NextResponse.json({ trade });
  } catch (error) {
    console.error("[TRADES_POST]", error);
    return NextResponse.json(
      { error: "Failed to create trade" },
      { status: 500 },
    );
  }
}
