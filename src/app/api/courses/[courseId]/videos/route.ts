import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Add a video to course
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
    const { title, description, url, duration, order } = body

    // Check if course exists and user is the instructor
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { videos: true }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    if (course.instructorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Determine order if not provided
    const videoOrder = order !== undefined ? order : course.videos.length + 1

    // Create video
    const video = await prisma.video.create({
      data: {
        title,
        description,
        url,
        duration,
        order: videoOrder,
        courseId
      }
    })

    return NextResponse.json({ success: true, video })
  } catch (error) {
    console.error('Video creation error:', error)
    return NextResponse.json(
      { error: 'Failed to add video' },
      { status: 500 }
    )
  }
}
