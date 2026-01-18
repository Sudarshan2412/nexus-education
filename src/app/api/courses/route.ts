import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Create a new course
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { title, description, category, level, price, thumbnail } = body

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        level: level || 'BEGINNER',
        price: price || 0,
        thumbnail,
        instructorId: session.user.id,
        published: false
      }
    })

    return NextResponse.json({ success: true, course })
  } catch (error) {
    console.error('Course creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}
