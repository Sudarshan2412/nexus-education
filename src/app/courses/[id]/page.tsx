import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { EnrollButton } from "@/components/courses/EnrollButton";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      instructor: {
        select: { name: true, email: true },
      },
      videos: {
        orderBy: { order: "asc" },
      },
      materials: true,
      exercises: true,
      codeRepos: true,
      enrollments: session?.user
        ? {
            where: { userId: session.user.id },
             select: { id: true, progress: true },
          }
        : false,
    },
  });

  if (!course) {
    notFound();
  }

  const isEnrolled =
    session?.user && course.enrollments && course.enrollments.length > 0;
  const enrollment = isEnrolled ? course.enrollments[0] : null;
  let progress = enrollment?.progress ?? 0;

  // Recompute exercise-based progress so previously submitted exercises reflect immediately
  if (isEnrolled && course.exercises.length > 0) {
    const answeredExercises = await prisma.exerciseSubmission.count({
      where: {
        userId: session!.user.id,
        exerciseId: { in: course.exercises.map((e) => e.id) },
      },
    });
    const computedProgress = (answeredExercises / course.exercises.length) * 100;

    // Persist the updated progress for consistency
    if (Math.abs((enrollment?.progress ?? 0) - computedProgress) > 0.01) {
      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId: session!.user.id,
            courseId: course.id,
          },
        },
        data: {
          progress: computedProgress,
          completedAt: computedProgress === 100 ? new Date() : null,
        },
      });
    }

    progress = computedProgress;
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider">
                  {course.category}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-secondary/40 text-muted-foreground font-bold uppercase tracking-wider">
                  {course.level}
                </span>
              </div>

              <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                {course.title}
              </h1>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {course.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>By {course.instructor.name}</span>
                <span>•</span>
                <span>{course.videos.length} videos</span>
                <span>•</span>
                <span>{course.exercises.length} exercises</span>
              </div>
            </div>

            {/* Course Content */}
            {isEnrolled && (
              <>
                <div className="glass-card p-6">
                  <h2 className="text-xl font-display font-bold text-foreground mb-4">
                    Course Content
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Video Material:
                      </h3>
                      <div className="space-y-2">
                        {course.videos.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No videos yet.
                          </p>
                        ) : (
                          course.videos.map((video: any, index: number) => (
                            <div
                              key={video.id}
                              className="p-3 rounded-lg border border-border/60"
                            >
                              <span className="text-sm text-foreground font-medium">
                                {index + 1}. {video.title}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Text Material
                      </h3>
                      <div className="space-y-2">
                        {course.materials.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No materials yet.
                          </p>
                        ) : (
                          course.materials.map(
                            (material: any, index: number) => (
                              <div
                                key={material.id}
                                className="p-3 rounded-lg border border-border/60"
                              >
                                <span className="text-sm text-foreground font-medium">
                                  {index + 1}. {material.title}
                                </span>
                              </div>
                            ),
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {course.codeRepos.length > 0 && (
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-display font-bold text-foreground mb-4">
                      Code Repositories
                    </h2>
                    <div className="space-y-3">
                      {course.codeRepos.map((repo: any) => (
                        <a
                          key={repo.id}
                          href={repo.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 rounded-lg border border-border/60 hover:border-primary/60 hover:bg-primary/5 transition-colors"
                        >
                          <h3 className="font-semibold text-foreground">
                            {repo.name}
                          </h3>
                          {repo.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {repo.description}
                            </p>
                          )}
                          <span className="text-sm text-primary mt-2 inline-block">
                            View on GitHub →
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-4">
              {session?.user ? (
                isEnrolled ? (
                  <div className="space-y-3">
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-3 rounded-lg border border-emerald-500/20">
                      You are enrolled in this course
                    </div>
                    <Link
                      href={`/courses/${course.id}/learn`}
                      className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-lg hover:bg-primary/90 transition"
                    >
                      Continue Learning
                    </Link>

                      <div className="pt-2">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                          Your progress
                        </p>
                        <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${Math.round(progress)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{Math.round(progress)}%</span>
                          <span>{progress === 100 ? "Complete" : "In progress"}</span>
                        </div>
                      </div>
                  </div>
                ) : (
                  <EnrollButton
                    courseId={course.id}
                    className="w-full justify-center"
                  />
                )
              ) : (
                <Link
                  href="/auth/signin"
                  className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-lg hover:bg-primary/90 transition"
                >
                  Sign in to Enroll
                </Link>
              )}

              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-foreground">
                  This course includes:
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span>📹</span>
                    <span>{course.videos.length} video lectures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📄</span>
                    <span>
                      {course.materials.length} downloadable resources
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✏️</span>
                    <span>{course.exercises.length} exercises</span>
                  </li>
                  {course.codeRepos.length > 0 && (
                    <li className="flex items-center gap-2">
                      <span>💻</span>
                      <span>{course.codeRepos.length} code repositories</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
