import { prisma } from "./prisma";

/**
 * Recalculate course progress purely from answered exercises.
 * An exercise counts once the student has submitted an answer, regardless of correctness.
 */
export async function updateCourseProgress(userId: string, courseId: string) {
  const exercises = await prisma.exercise.findMany({
    where: { courseId },
    select: { id: true },
  });

  const totalExercises = exercises.length;
  if (totalExercises === 0) return;

  const answeredExercises = await prisma.exerciseSubmission.count({
    where: {
      userId,
      exerciseId: { in: exercises.map((e) => e.id) },
    },
  });

  const progressPercentage = (answeredExercises / totalExercises) * 100;

  await prisma.enrollment.update({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    data: {
      progress: progressPercentage,
      completedAt: progressPercentage === 100 ? new Date() : null,
    },
  });
}
