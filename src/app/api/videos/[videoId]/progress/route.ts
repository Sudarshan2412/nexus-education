import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateCourseProgress } from '@/lib/progress'

// POST /api/videos/[videoId]/progress - Update video progress
export async function POST(
    req: NextRequest,
    { params }: { params: { videoId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { lastPosition, completed } = body
        const { videoId } = params

        // Check if video exists
        const video = await prisma.video.findUnique({
            where: { id: videoId },
            include: { course: true }
        })

        if (!video) {
            return NextResponse.json(
                { error: 'Video not found' },
                { status: 404 }
            )
        }

        // Check enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: video.courseId
                }
            }
        })

        if (!enrollment) {
            return NextResponse.json(
                { error: 'Not enrolled in this course' },
                { status: 403 }
            )
        }

        // Upsert video progress
        const videoProgress = await prisma.videoProgress.upsert({
            where: {
                userId_videoId: {
                    userId: session.user.id,
                    videoId: videoId
                }
            },
            update: {
                lastPosition: lastPosition || 0,
                completed: completed || false,
                updatedAt: new Date()
            },
            create: {
                userId: session.user.id,
                videoId: videoId,
                lastPosition: lastPosition || 0,
                completed: completed || false
            }
        })

        // Update course progress (videos + answered exercises)
        await updateCourseProgress(session.user.id, video.courseId)

        return NextResponse.json({ videoProgress })

    } catch (error) {
        console.error('Update progress error:', error)
        return NextResponse.json(
            { error: 'Failed to update progress' },
            { status: 500 }
        )
    }
}

// GET /api/videos/[videoId]/progress - Get video progress
export async function GET(
    req: NextRequest,
    { params }: { params: { videoId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ lastPosition: 0, completed: false })
        }

        const { videoId } = params

        const videoProgress = await prisma.videoProgress.findUnique({
            where: {
                userId_videoId: {
                    userId: session.user.id,
                    videoId: videoId
                }
            }
        })

        return NextResponse.json({
            lastPosition: videoProgress?.lastPosition || 0,
            completed: videoProgress?.completed || false
        })

    } catch (error) {
        console.error('Get progress error:', error)
        return NextResponse.json({ lastPosition: 0, completed: false })
    }
}

// Progress calculation now lives in lib/progress
