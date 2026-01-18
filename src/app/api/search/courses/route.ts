import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json({ courses: [] })
    }

    const courses = await prisma.course.findMany({
      where: {
        AND: [
          { published: true },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { category: { contains: query, mode: 'insensitive' } },
              {
                instructor: {
                  name: { contains: query, mode: 'insensitive' }
                }
              }
            ]
          }
        ]
      },
      include: {
        instructor: {
          select: {
            name: true,
            id: true
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      take: 20,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Course search error:', error)
    return NextResponse.json(
      { error: 'Failed to search courses' },
      { status: 500 }
    )
  }
}
