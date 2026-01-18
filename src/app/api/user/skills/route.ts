import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { skills } = body

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { message: 'Skills must be an array' },
        { status: 400 }
      )
    }

    // Validate skills (max 10, each max 30 chars)
    if (skills.length > 10) {
      return NextResponse.json(
        { message: 'Maximum 10 skills allowed' },
        { status: 400 }
      )
    }

    if (skills.some(skill => skill.length > 30)) {
      return NextResponse.json(
        { message: 'Each skill must be 30 characters or less' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { skills },
    })

    return NextResponse.json(
      { 
        message: 'Skills updated successfully',
        skills: updatedUser.skills 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update skills error:', error)
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
