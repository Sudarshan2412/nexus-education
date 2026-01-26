import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TradeStatus } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { tradeId: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trade = await prisma.courseTrade.findUnique({
      where: { id: params.tradeId },
      include: {
        requesterCourse: true,
        recipientCourse: true,
      },
    });

    if (!trade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    if (trade.recipientId !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    if (trade.status !== TradeStatus.PENDING) {
      return NextResponse.json({ error: "Trade already processed" }, { status: 400 });
    }

    if (
      !trade.requesterCourse.published ||
      trade.requesterCourse.price !== 50 ||
      !trade.recipientCourse.published ||
      trade.recipientCourse.price !== 50
    ) {
      return NextResponse.json(
        { error: "Both courses must be published 50-credit courses" },
        { status: 400 },
      );
    }

    const requesterEnrollment = prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: trade.requesterId,
          courseId: trade.recipientCourseId,
        },
      },
      create: {
        userId: trade.requesterId,
        courseId: trade.recipientCourseId,
      },
      update: {},
    });

    const recipientEnrollment = prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: trade.recipientId,
          courseId: trade.requesterCourseId,
        },
      },
      create: {
        userId: trade.recipientId,
        courseId: trade.requesterCourseId,
      },
      update: {},
    });

    const updatedTrade = prisma.courseTrade.update({
      where: { id: trade.id },
      data: { status: TradeStatus.ACCEPTED },
    });

    const [_, __, finalTrade] = await prisma.$transaction([
      requesterEnrollment,
      recipientEnrollment,
      updatedTrade,
    ]);

    return NextResponse.json({ trade: finalTrade });
  } catch (error) {
    console.error("[TRADE_ACCEPT]", error);
    return NextResponse.json(
      { error: "Failed to accept trade" },
      { status: 500 },
    );
  }
}
