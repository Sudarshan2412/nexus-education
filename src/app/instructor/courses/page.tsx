import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Video, Users, FileText, Plus, Edit, Eye } from 'lucide-react'

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
    <div className="min-h-screen bg-grain bg-brand-dark">
      <Header />

      <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tighter text-white text-glow mb-2">
                My Courses
              </h1>
              <p className="text-gray-400 uppercase tracking-wider text-xs">
                Manage your courses and content
              </p>
            </div>
            <Link
              href="/instructor/courses/new"
              className="flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-full transition-all button-glow font-bold uppercase tracking-wider text-sm"
            >
              <Plus className="w-4 h-4" />
              Create Course
            </Link>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {courses.map((course: any) => (
              <div key={course.id} className="glass-card p-8 fade-in hover:border-brand-blue/30 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {course.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${course.published
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        }`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                      {course.description || 'No description provided yet'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="p-1.5 bg-brand-blue/10 rounded-lg">
                          <Video className="w-4 h-4 text-brand-blue" />
                        </div>
                        <span className="text-xs font-mono">{course._count.videos} videos</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                          <Users className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-xs font-mono">{course._count.enrollments} students</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="p-1.5 bg-purple-500/10 rounded-lg">
                          <FileText className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-xs font-mono">{course._count.exercises} exercises</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 ml-6">
                    <Link
                      href={`/instructor/courses/${course.id}/edit`}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors text-xs font-bold uppercase tracking-wider text-gray-300"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors text-xs font-bold uppercase tracking-wider text-gray-300"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-brand-blue" />
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">
                No Courses Yet
              </h3>
              <p className="text-gray-400 mb-8 text-sm">
                Create your first course to get started
              </p>
              <Link
                href="/instructor/courses/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-full transition-all button-glow font-bold uppercase tracking-wider text-sm"
              >
                <Plus className="w-4 h-4" />
                Create Course
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
