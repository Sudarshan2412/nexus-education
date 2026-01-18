import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/code-repos/[repoId] - remove repository connection
export async function DELETE(
  req: NextRequest,
  { params }: { params: { repoId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repo = await prisma.codeRepository.findUnique({
      where: { id: params.repoId },
      include: { course: { select: { instructorId: true } } },
    });

    if (!repo) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }

    if (repo.course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.codeRepository.delete({ where: { id: params.repoId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete code repo error:", error);
    return NextResponse.json({ error: "Failed to remove repository" }, { status: 500 });
  }
}
