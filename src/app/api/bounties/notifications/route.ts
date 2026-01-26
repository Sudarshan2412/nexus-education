import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const summary = req.nextUrl.searchParams.get("summary");
    if (summary) {
      const count = await prisma.bountyNotification.count({
        where: { userId: session.user.id, seen: false },
      });
      return NextResponse.json({ unseenCount: count });
    }

    const notifications = await prisma.bountyNotification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        bounty: {
          select: { title: true, amount: true, fulfilledCourse: { select: { title: true } } },
        },
      },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("[BOUNTY_NOTIFICATIONS_GET]", error);
    return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.bountyNotification.updateMany({
      where: { userId: session.user.id, seen: false },
      data: { seen: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[BOUNTY_NOTIFICATIONS_READ]", error);
    return NextResponse.json({ error: "Failed to mark notifications" }, { status: 500 });
  }
}
