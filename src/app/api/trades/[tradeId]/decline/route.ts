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

    const trade = await prisma.courseTrade.findUnique({ where: { id: params.tradeId } });

    if (!trade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    if (trade.recipientId !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    if (trade.status !== TradeStatus.PENDING) {
      return NextResponse.json({ error: "Trade already processed" }, { status: 400 });
    }

    const updated = await prisma.courseTrade.update({
      where: { id: trade.id },
      data: { status: TradeStatus.DECLINED },
    });

    return NextResponse.json({ trade: updated });
  } catch (error) {
    console.error("[TRADE_DECLINE]", error);
    return NextResponse.json(
      { error: "Failed to decline trade" },
      { status: 500 },
    );
  }
}
