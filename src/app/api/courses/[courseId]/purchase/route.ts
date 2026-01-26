import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const { courseId } = params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        price: true,
        published: true,
        instructorId: true,
        title: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (!course.published) {
      return NextResponse.json(
        { error: "Course is not published" },
        { status: 400 },
      );
    }

    if (course.price !== 50) {
      return NextResponse.json(
        { error: "This course is free and does not require credits" },
        { status: 400 },
      );
    }

    // Prevent duplicate enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.credits < 50) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 },
      );
    }

    const [updatedUser, enrollment] = await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 50 } },
        select: { credits: true },
      }),
      prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId,
          progress: 0,
        },
        include: {
          course: {
            select: { title: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      message: "Successfully purchased course",
      credits: updatedUser.credits,
      enrollment,
    });
  } catch (error) {
    console.error("[COURSE_PURCHASE]", error);
    return NextResponse.json(
      { error: "Failed to purchase course" },
      { status: 500 },
    );
  }
}
