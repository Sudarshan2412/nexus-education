import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Header } from '@/components/Header'
import { prisma } from '@/lib/prisma'
import { CourseCard } from '@/components/CourseCard'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              instructor: {
                select: { name: true }
              }
            }
          }
        }
      },
      coursesCreated: {
        include: {
          instructor: {
            select: { name: true }
          }
        }
      }
    }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary-600 text-white flex items-center justify-center text-3xl font-bold">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded text-sm">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.enrollments.length > 0 ? (
              user.enrollments.map((enrollment: any) => (
                <CourseCard key={enrollment.id} {...enrollment.course} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg">
                You haven&apos;t enrolled in any courses yet.
              </div>
            )}
          </div>
        </div>

        {/* Created Courses */}
        <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <a
                href="/instructor/courses/new"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Create Course
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.coursesCreated.length > 0 ? (
                user.coursesCreated.map((course: any) => (
                  <CourseCard key={course.id} {...course} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg">
                  You haven&apos;t created any courses yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
