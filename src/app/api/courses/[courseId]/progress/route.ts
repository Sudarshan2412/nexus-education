import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get progress for a course
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = params

    // Get enrollment with video progress
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      },
      include: {
        videoProgress: true,
        course: {
          include: {
            videos: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      enrollment,
      progress: enrollment.progress,
      videoProgress: enrollment.videoProgress
    })
  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

// Update video progress
export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = params
    const body = await req.json()
    const { videoId, watchTime, completed } = body

    // Get enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      },
      include: {
        course: {
          include: {
            videos: true
          }
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 404 }
      )
    }

    // Update or create video progress
    const videoProgress = await prisma.videoProgress.upsert({
      where: {
        userId_videoId: {
          userId: session.user.id,
          videoId: videoId
        }
      },
      update: {
        watchTime: watchTime,
        completed: completed,
        lastWatched: new Date()
      },
      create: {
        userId: session.user.id,
        videoId: videoId,
        enrollmentId: enrollment.id,
        watchTime: watchTime,
        completed: completed
      }
    })

    // Calculate overall course progress
    const totalVideos = enrollment.course.videos.length
    if (totalVideos > 0) {
      const completedVideos = await prisma.videoProgress.count({
        where: {
          enrollmentId: enrollment.id,
          completed: true
        }
      })

      const progress = (completedVideos / totalVideos) * 100

      // Update enrollment progress
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { 
          progress,
          completedAt: progress === 100 ? new Date() : null
        }
      })

      return NextResponse.json({
        success: true,
        videoProgress,
        courseProgress: progress
      })
    }

    return NextResponse.json({
      success: true,
      videoProgress,
      courseProgress: enrollment.progress
    })
  } catch (error) {
    console.error('Progress update error:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
