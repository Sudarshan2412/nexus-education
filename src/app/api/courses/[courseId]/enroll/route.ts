import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEnrollmentEmail } from '@/lib/mail'

// POST /api/courses/[courseId]/enroll - Enroll in a course
export async function POST(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            )
        }

        const { courseId } = params

        // Check if course exists and is published
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: { instructor: { select: { name: true } } }
        })

        if (!course) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            )
        }

        if (!course.published) {
            return NextResponse.json(
                { error: 'Course is not published yet' },
                { status: 400 }
            )
        }

        if (course.price === 50) {
            return NextResponse.json(
                { error: 'This course costs 50 credits. Purchase or trade to access.' },
                { status: 400 }
            )
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId
                }
            }
        })

        if (existingEnrollment) {
            return NextResponse.json(
                { error: 'Already enrolled in this course' },
                { status: 400 }
            )
        }

        // Create enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                userId: session.user.id,
                courseId: courseId,
                progress: 0
            },
            include: {
                course: {
                    select: {
                        title: true,
                        instructor: {
                            select: { name: true }
                        }
                    }
                }
            }
        })

        return NextResponse.json({
            message: 'Successfully enrolled in course',
            enrollment
        }, { status: 201 })

    } catch (error) {
        console.error('Enrollment error:', error)
        return NextResponse.json(
            { error: 'Failed to enroll in course' },
            { status: 500 }
        )
    }
}

// DELETE /api/courses/[courseId]/enroll - Unenroll from a course
export async function DELETE(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            )
        }

        const { courseId } = params

        // Delete enrollment
        const enrollment = await prisma.enrollment.deleteMany({
            where: {
                userId: session.user.id,
                courseId: courseId
            }
        })

        if (enrollment.count === 0) {
            return NextResponse.json(
                { error: 'Not enrolled in this course' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            message: 'Successfully unenrolled from course'
        })

    } catch (error) {
        console.error('Unenrollment error:', error)
        return NextResponse.json(
            { error: 'Failed to unenroll from course' },
            { status: 500 }
        )
    }
}

// GET /api/courses/[courseId]/enroll - Check enrollment status
export async function GET(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ enrolled: false })
        }

        const { courseId } = params

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId
                }
            },
            select: {
                id: true,
                progress: true,
                enrolledAt: true
            }
        })

        return NextResponse.json({
            enrolled: !!enrollment,
            enrollment: enrollment
        })

    } catch (error) {
        console.error('Check enrollment error:', error)
        return NextResponse.json({ enrolled: false })
    }
}
