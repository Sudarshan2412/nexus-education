import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Header } from '@/components/Header'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function InstructorCoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    include: {
      _count: {
        select: {
          videos: true,
          enrollments: true,
          exercises: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Courses</h1>
            <p className="text-gray-600">Manage your courses and content</p>
          </div>
          <Link
            href="/instructor/courses/new"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Create New Course
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {courses.map((course: any) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{course.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        course.published 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>📹 {course._count.videos} videos</span>
                      <span>👥 {course._count.enrollments} students</span>
                      <span>✏️ {course._count.exercises} exercises</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/instructor/courses/${course.id}/edit`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/courses/${course.id}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-6">Create your first course to get started</p>
            <Link
              href="/instructor/courses/new"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Create Course
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
