import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { MCQQuestion } from "@/components/exercises/MCQQuestion";

export default async function CourseExercisesPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/courses/${params.id}/learn/exercises`);
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
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
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
              Exercises
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
              {course.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {course.exercises.length === 0
                ? "No exercises available yet."
                : `${course.exercises.length} question${course.exercises.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <Link
            href={`/courses/${course.id}/learn`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 hover:border-primary/60 hover:bg-primary/5 text-sm font-semibold text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to learning
          </Link>
        </div>

        {course.exercises.length === 0 ? (
          <div className="glass-card p-6 text-sm text-muted-foreground">
            No exercises have been added for this course yet.
          </div>
        ) : (
          <div className="space-y-4">
            {course.exercises.map((ex) => (
              <div key={ex.id} className="glass-card p-4 sm:p-6 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      {ex.title}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {ex.type || "Exercise"}
                    </p>
                  </div>
                  {ex.points != null && (
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {ex.points} pts
                    </span>
                  )}
                </div>

                {ex.type === "MCQ" && ex.question && ex.options ? (
                  <MCQQuestion
                    exerciseId={ex.id}
                    question={ex.question}
                    options={ex.options}
                    points={ex.points || 0}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {ex.type === "MCQ"
                      ? "This question is missing data."
                      : "Exercise type not yet supported here."}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
