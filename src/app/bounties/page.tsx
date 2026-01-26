import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { BountiesClient } from "./BountiesClient";

export const dynamic = "force-dynamic";

export default async function BountiesPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  const [bounties, myCourses] = await Promise.all([
    prisma.bounty.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { id: true, name: true } },
        fulfilledBy: { select: { id: true, name: true } },
        fulfilledCourse: { select: { id: true, title: true } },
      },
    }),
    userId
      ? prisma.course.findMany({
          where: { instructorId: userId, published: true },
          select: { id: true, title: true },
          orderBy: { createdAt: "desc" },
        })
      : [],
  ]);

  return (
    <main className="min-h-screen bg-grain bg-brand-dark">
      <Header />
      <BountiesClient bounties={bounties} myCourses={myCourses} canCreate={!!userId} />
    </main>
  );
}
