import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, ListVideo } from "lucide-react";
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Course Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-x-2 text-xl font-bold mb-6 text-gray-400 uppercase tracking-widest">
                            <LayoutDashboard className="w-6 h-6 text-brand-blue" />
                            <h2>Customize Course</h2>
                        </div>

                        {/* Title */}
                        <div className="glass-card p-6 fade-in">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                Course Title
                            </h3>
                            <p className="text-white text-lg font-medium">{course.title}</p>
                        </div>

                        {/* Description */}
                        <div className="glass-card p-6 fade-in">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                Description
                            </h3>
                            <p className="text-gray-400 italic text-sm">
                                {course.description || "No description yet"}
                            </p>
                        </div>

                        {/* Thumbnail */}
                        <div className="glass-card p-6 fade-in">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                Course Thumbnail
                            </h3>
                            <div className="h-40 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-500">
                                <span className="text-xs uppercase tracking-wider">No image uploaded</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Videos */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-x-2 text-xl font-bold mb-6 text-gray-400 uppercase tracking-widest">
                            <ListVideo className="w-6 h-6 text-brand-blue" />
                            <h2>Course Videos</h2>
                        </div>

                        <EditClient course={course} />
                    </div>
                </div>
            </div>
        </div>
    );
}
