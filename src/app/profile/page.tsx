import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { prisma } from '@/lib/prisma'
import { CourseCard } from '@/components/courses/CourseCard'
import { User, BookOpen, GraduationCap, Plus } from 'lucide-react'
import Link from 'next/link'

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
    <main className="min-h-screen bg-grain bg-brand-dark">
      <Header />

      <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
        {/* Profile Header */}
        <div className="glass-card p-8 mb-12 fade-in">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue flex items-center justify-center text-3xl font-bold uppercase">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-display font-bold uppercase tracking-tighter text-white text-glow mb-2">
                {user.name}
              </h1>
              <p className="text-gray-400 mb-3">{user.email}</p>
              <span className="inline-block px-4 py-1.5 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-brand-blue" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400">
              My Learning
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.enrollments.length > 0 ? (
              user.enrollments.map((enrollment: any) => (
                <CourseCard key={enrollment.id} {...enrollment.course} />
              ))
            ) : (
              <div className="col-span-full glass-card p-12 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">
                  No Courses Enrolled
                </h3>
                <p className="text-gray-400 mb-6 text-sm">
                  You haven&apos;t enrolled in any courses yet.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-full transition-all button-glow font-bold uppercase tracking-wider text-sm"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Created Courses (Only for Instructors) */}
        {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-brand-blue" />
                <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400">
                  My Courses
                </h2>
              </div>
              <Link
                href="/instructor/courses/new"
                className="flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-full transition-all button-glow font-bold uppercase tracking-wider text-sm"
              >
                <Plus className="w-4 h-4" />
                Create Course
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.coursesCreated.length > 0 ? (
                user.coursesCreated.map((course: any) => (
                  <CourseCard key={course.id} {...course} />
                ))
              ) : (
                <div className="col-span-full glass-card p-12 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-10 h-10 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">
                    No Courses Created
                  </h3>
                  <p className="text-gray-400 mb-6 text-sm">
                    You haven&apos;t created any courses yet.
                  </p>
                  <Link
                    href="/instructor/courses/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-full transition-all button-glow font-bold uppercase tracking-wider text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create Course
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
