import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/courses/[courseId]/code-repos - Connect a GitHub repository to the course
export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = params;
    const body = await req.json();
    const { name, repoUrl, description, branch } = body;

    if (!name || !repoUrl) {
      return NextResponse.json({ error: "Name and repoUrl are required" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const codeRepo = await prisma.codeRepository.create({
      data: {
        courseId,
        name,
        repoUrl,
        description: description || null,
        branch: branch || "main",
      },
    });

    return NextResponse.json(codeRepo);
  } catch (error) {
    console.error("Create code repo error:", error);
    return NextResponse.json({ error: "Failed to connect repository" }, { status: 500 });
  }
}
