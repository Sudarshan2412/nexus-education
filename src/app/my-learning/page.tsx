import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { prisma } from '@/lib/prisma'
import { CourseCard } from '@/components/courses/CourseCard'
import { BookOpen, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MyLearningPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/auth/signin')
    }

    const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: {
            course: {
                include: {
                    instructor: {
                        select: { name: true }
                    }
                }
            }
        },
        orderBy: { enrolledAt: 'desc' }
    })

    return (
        <main className="min-h-screen bg-grain bg-brand-dark">
            <Header />

            <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-brand-blue/10 rounded-xl">
                            <BookOpen className="w-8 h-8 text-brand-blue" />
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tighter text-white text-glow">
                                My Learning
                            </h1>
                            <p className="text-gray-400 uppercase tracking-wider text-xs mt-2">
                                Continue your learning journey
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card p-6 fade-in">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                Enrolled Courses
                            </span>
                            <BookOpen className="w-5 h-5 text-brand-blue" />
                        </div>
                        <p className="text-4xl font-display font-bold text-white tracking-tighter">
                            {enrollments.length}
                        </p>
                    </div>

                    <div className="glass-card p-6 fade-in">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                In Progress
                            </span>
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <p className="text-4xl font-display font-bold text-emerald-400 tracking-tighter">
                            {enrollments.filter(e => !e.completedAt).length}
                        </p>
                    </div>

                    <div className="glass-card p-6 fade-in">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                Avg Progress
                            </span>
                            <TrendingUp className="w-5 h-5 text-brand-blue" />
                        </div>
                        <p className="text-4xl font-display font-bold text-white tracking-tighter">
                            {enrollments.length > 0
                                ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                                : 0}%
                        </p>
                    </div>
                </div>

                {/* Courses Grid */}
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400 mb-6 pl-1">
                        Your Courses
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.length > 0 ? (
                            enrollments.map((enrollment: any) => (
                                <CourseCard key={enrollment.id} {...enrollment.course} />
                            ))
                        ) : (
                            <div className="col-span-full glass-card p-16 text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="w-10 h-10 text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">
                                    No Courses Yet
                                </h3>
                                <p className="text-gray-400 mb-8 text-sm">
                                    Start learning by enrolling in a course
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
            </div>
        </main>
    )
}
