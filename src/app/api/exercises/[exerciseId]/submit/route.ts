import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateCourseProgress } from '@/lib/progress'

// POST /api/exercises/[exerciseId]/submit - Submit exercise answer
export async function POST(
    req: NextRequest,
    { params }: { params: { exerciseId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { answer } = await req.json()
        const { exerciseId } = params

        const exercise = await prisma.exercise.findUnique({
            where: { id: exerciseId },
            include: { course: true }
        })

        if (!exercise) {
            return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
        }

        // Check enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: exercise.courseId
                }
            }
        })

        if (!enrollment) {
            return NextResponse.json({ error: 'Not enrolled' }, { status: 403 })
        }

        // Auto-grade for MCQ
        let score: number | null = null
        if (exercise.type === 'MCQ' && exercise.correctAnswer) {
            score = answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase()
                ? exercise.points
                : 0
        }

        // Upsert submission
        const submission = await prisma.exerciseSubmission.upsert({
            where: {
                exerciseId_userId: {
                    exerciseId,
                    userId: session.user.id
                }
            },
            update: {
                answer,
                score
            },
            create: {
                exerciseId,
                userId: session.user.id,
                answer,
                score
            }
        })

        // Update overall course progress to include answered exercises
        await updateCourseProgress(session.user.id, exercise.courseId)

        return NextResponse.json({
            submission,
            correct: score === exercise.points,
            score,
            maxScore: exercise.points
        })

    } catch (error) {
        console.error('Submit exercise error:', error)
        return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
    }
}

// GET /api/exercises/[exerciseId]/submit - Get user's submission
export async function GET(
    req: NextRequest,
    { params }: { params: { exerciseId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ submission: null })
        }

        const submission = await prisma.exerciseSubmission.findUnique({
            where: {
                exerciseId_userId: {
                    exerciseId: params.exerciseId,
                    userId: session.user.id
                }
            }
        })

        return NextResponse.json({ submission })
    } catch (error) {
        return NextResponse.json({ submission: null })
    }
}
