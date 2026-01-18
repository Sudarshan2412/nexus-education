import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/courses/[courseId]/reviews
export async function GET(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const reviews = await prisma.review.findMany({
            where: { courseId: params.courseId },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0

        return NextResponse.json({
            reviews,
            avgRating: Math.round(avgRating * 10) / 10,
            totalReviews: reviews.length
        })
    } catch (error) {
        return NextResponse.json({ reviews: [], avgRating: 0, totalReviews: 0 })
    }
}

// POST /api/courses/[courseId]/reviews
export async function POST(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { rating, comment } = await req.json()

        // Check enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: params.courseId
                }
            }
        })

        if (!enrollment) {
            return NextResponse.json(
                { error: 'Must be enrolled to review' },
                { status: 403 }
            )
        }

        const review = await prisma.review.upsert({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: params.courseId
                }
            },
            update: { rating, comment },
            create: {
                userId: session.user.id,
                courseId: params.courseId,
                rating,
                comment
            },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            }
        })

        return NextResponse.json(review, { status: 201 })
    } catch (error) {
        console.error('Review error:', error)
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
    }
}
