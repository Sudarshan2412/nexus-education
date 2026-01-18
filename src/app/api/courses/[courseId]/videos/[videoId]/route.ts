import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Update video
export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string; videoId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId, videoId } = params
    const body = await req.json()

    // Check if course exists and user is the instructor
    const course = await prisma.course.findUnique({
      where: { id: courseId }
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

    // Update video
    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        title: body.title,
        description: body.description,
        url: body.url,
        duration: body.duration,
        order: body.order
      }
    })

    return NextResponse.json({ success: true, video })
  } catch (error) {
    console.error('Video update error:', error)
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    )
  }
}

// Delete video
export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string; videoId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId, videoId } = params

    // Check if course exists and user is the instructor
    const course = await prisma.course.findUnique({
      where: { id: courseId }
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

    // Delete video
    await prisma.video.delete({
      where: { id: videoId }
    })

    return NextResponse.json({ success: true, message: 'Video deleted' })
  } catch (error) {
    console.error('Video deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}
