import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bounties = await prisma.bounty.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { id: true, name: true } },
        fulfilledBy: { select: { id: true, name: true } },
        fulfilledCourse: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(bounties);
  } catch (error) {
    console.error("[BOUNTIES_GET]", error);
    return NextResponse.json({ error: "Failed to load bounties" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const title = (body?.title ?? "").trim();
    const description = (body?.description ?? "").trim();
    const amount = Number(body?.amount ?? 0);

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive integer" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.credits < amount) {
      return NextResponse.json({ error: "Insufficient credits to fund bounty" }, { status: 400 });
    }

    const bounty = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: amount } },
      });

      return tx.bounty.create({
        data: {
          title,
          description,
          amount,
          createdById: session.user.id,
        },
      });
    });

    return NextResponse.json(bounty, { status: 201 });
  } catch (error) {
    console.error("[BOUNTIES_POST]", error);
    return NextResponse.json({ error: "Failed to create bounty" }, { status: 500 });
  }
}
