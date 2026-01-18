import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Settings } from "lucide-react";
import { EditClient } from "./_components/EditClient";

export default async function CourseEditPage({
    params
}: {
    params: { courseId: string }
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return redirect("/");
    }

    const course = await prisma.course.findUnique({
        where: {
            id: params.courseId,
            instructorId: session.user.id
        },
        include: {
            videos: {
                orderBy: {
                    order: "asc",
                },
            },
            materials: true,
            exercises: true,
        },
    });

    if (!course) {
        return redirect("/instructor/courses");
    }

    return (
        <div className="min-h-screen bg-grain bg-brand-dark">
            <Header />
            <div className="max-w-[1400px] mx-auto p-6 pt-12 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href="/instructor/courses"
                            className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
                        </Link>
                        <div className="flex flex-col gap-y-1">
                            <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white text-glow">
                                Course Setup
                            </h1>
                            <span className="text-xs text-gray-400 uppercase tracking-widest">
                                Complete all fields to publish your course
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column - Course Details */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="flex items-center gap-x-2 text-xl font-bold mb-6 text-gray-400 uppercase tracking-widest">
                            <LayoutDashboard className="w-6 h-6 text-primary" />
                            <h2>General Info</h2>
                        </div>

                        {/* Title */}
                        <div className="glass-card p-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                                Course Title
                            </h3>
                            <p className="text-white text-lg font-bold uppercase tracking-tight">{course.title}</p>
                        </div>

                        {/* Description */}
                        <div className="glass-card p-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                                Description
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {course.description || "No description provided."}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="glass-card p-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">
                                Content Stats
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total Videos</p>
                                    <p className="text-2xl font-display font-bold text-primary">{course.videos.length}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Learning Materials</p>
                                    <p className="text-2xl font-display font-bold text-neon-purple">{course.materials.length}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Quiz Exercises</p>
                                    <p className="text-2xl font-display font-bold text-neon-green">{course.exercises.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Content Management */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="flex items-center gap-x-2 text-xl font-bold mb-6 text-gray-400 uppercase tracking-widest">
                            <Settings className="w-6 h-6 text-primary" />
                            <h2>Content Management</h2>
                        </div>

                        <EditClient course={course} />
                    </div>
                </div>
            </div>
        </div>
    );
}
