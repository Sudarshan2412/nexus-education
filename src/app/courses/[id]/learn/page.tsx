import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { CourseLearnClient } from "./CourseLearnClient";

export default async function CourseLearnPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/courses/${params.id}/learn`);
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      videos: { orderBy: { order: "asc" } },
      materials: { orderBy: { createdAt: "desc" } },
      exercises: { orderBy: { createdAt: "asc" } },
      enrollments: {
        where: { userId: session!.user.id },
        select: { id: true },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const isEnrolled = course.enrollments && course.enrollments.length > 0;
  if (!isEnrolled) {
    redirect(`/courses/${course.id}`);
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <CourseLearnClient
          courseId={course.id}
          courseTitle={course.title}
          videos={course.videos.map((v) => ({
            id: v.id,
            title: v.title,
            description: v.description,
            url: v.url,
            duration: v.duration,
            order: v.order,
          }))}
          materials={course.materials.map((m) => ({
            id: m.id,
            title: m.title,
            url: m.url,
            type: m.type,
            size: m.size,
          }))}
          exercises={course.exercises.map((e) => ({
            id: e.id,
            title: e.title,
            type: e.type,
            points: e.points,
            question: e.question,
            options: e.options,
          }))}
        />
      </div>
    </main>
  );
}
