import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/courses/[courseId]/exercises - Get all exercises for a course
export async function GET(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const exercises = await prisma.exercise.findMany({
            where: { courseId: params.courseId },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                points: true,
                createdAt: true
            }
        })

        return NextResponse.json(exercises)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 })
    }
}

// POST /api/courses/[courseId]/exercises - Create exercise (Instructor only)
export async function POST(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { title, description, type, question, options, correctAnswer, points } = body

        // Verify course ownership
        const course = await prisma.course.findUnique({
            where: { id: params.courseId }
        })

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 })
        }

        if (session.user.role !== 'ADMIN' && course.instructorId !== session.user.id) {
            return NextResponse.json({ error: 'Not your course' }, { status: 403 })
        }

        const exercise = await prisma.exercise.create({
            data: {
                title,
                description,
                type,
                question,
                options: options || null,
                correctAnswer: correctAnswer || null,
                points: points || 10,
                courseId: params.courseId
            }
        })

        return NextResponse.json(exercise, { status: 201 })
    } catch (error) {
        console.error('Create exercise error:', error)
        return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 })
    }
}
