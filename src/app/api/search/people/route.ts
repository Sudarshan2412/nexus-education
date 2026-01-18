import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json({ users: [] })
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          {
            skills: {
              hasSome: [query]
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        skills: true,
        _count: {
          select: {
            coursesCreated: true,
            enrollments: true
          }
        }
      },
      take: 20,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('People search error:', error)
    return NextResponse.json(
      { error: 'Failed to search people' },
      { status: 500 }
    )
  }
}
