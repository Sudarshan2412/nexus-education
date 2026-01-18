import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CoursePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      instructor: {
        select: { name: true, email: true }
      },
      videos: {
        orderBy: { order: 'asc' }
      },
      materials: true,
      exercises: true,
      codeRepos: true,
      enrollments: session?.user ? {
        where: { userId: session.user.id }
      } : false
    }
  })

  if (!course) {
    notFound()
  }

  const isEnrolled = session?.user && course.enrollments && course.enrollments.length > 0

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm px-3 py-1 bg-primary-100 text-primary-700 rounded">
                  {course.category}
                </span>
                <span className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded">
                  {course.level}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>By {course.instructor.name}</span>
                <span>•</span>
                <span>{course.videos.length} videos</span>
                <span>•</span>
                <span>{course.exercises.length} exercises</span>
              </div>
            </div>

            {/* Course Content */}
            {isEnrolled && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                  <div className="space-y-2">
                    {course.videos.map((video: any, index: number) => (
                      <div key={video.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{index + 1}. {video.title}</h3>
                            {video.description && (
                              <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                            )}
                          </div>
                          {video.duration && (
                            <span className="text-sm text-gray-500">{video.duration}m</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {course.codeRepos.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Code Repositories</h2>
                    <div className="space-y-3">
                      {course.codeRepos.map((repo: any) => (
                        <a
                          key={repo.id}
                          href={repo.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <h3 className="font-semibold">{repo.name}</h3>
                          {repo.description && (
                            <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                          )}
                          <span className="text-sm text-primary-600 mt-2 inline-block">
                            View on GitHub →
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">

              {session?.user ? (
                isEnrolled ? (
                  <div>
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4">
                      You are enrolled in this course
                    </div>
                    <Link
                      href={`/courses/${course.id}/learn`}
                      className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg hover:bg-primary-700 transition"
                    >
                      Continue Learning
                    </Link>
                  </div>
                ) : (
                  <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition">
                    Enroll Now
                  </button>
                )
              ) : (
                <Link
                  href="/auth/signin"
                  className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg hover:bg-primary-700 transition"
                >
                  Sign in to Enroll
                </Link>
              )}

              <div className="mt-6 space-y-4">
                <h3 className="font-semibold">This course includes:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span>📹</span>
                    <span>{course.videos.length} video lectures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📄</span>
                    <span>{course.materials.length} downloadable resources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✏️</span>
                    <span>{course.exercises.length} exercises</span>
                  </li>
                  {course.codeRepos.length > 0 && (
                    <li className="flex items-center gap-2">
                      <span>💻</span>
                      <span>{course.codeRepos.length} code repositories</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
