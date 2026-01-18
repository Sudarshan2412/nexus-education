"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CreateCoursePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/courses", {
                title,
            });
            router.push(`/instructor/courses/${response.data.id}/edit`);
            router.refresh();
        } catch (error) {
            console.error("Something went wrong", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-grain bg-brand-dark">
            <Header />
            <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 pt-20 relative z-10">
                <div className="glass-card p-12 w-full max-w-2xl fade-in">
                    {/* Back Button */}
                    <Link
                        href="/instructor/courses"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-xs uppercase tracking-wider font-bold"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Courses
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-brand-blue/10 rounded-xl">
                                <Sparkles className="w-6 h-6 text-brand-blue" />
                            </div>
                            <h1 className="text-4xl font-display font-bold uppercase tracking-tighter text-white text-glow">
                                Create Course
                            </h1>
                        </div>
                        <p className="text-gray-400 text-sm">
                            What would you like to name your course? Don't worry, you can change this later.
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                                Course Title
                            </label>
                            <input
                                disabled={loading}
                                type="text"
                                className="w-full h-14 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                placeholder="e.g. 'Advanced Web Development'"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-full transition-all text-xs font-bold uppercase tracking-wider"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!title || loading}
                                className="flex-1 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all button-glow text-xs font-bold uppercase tracking-wider"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating...
                                    </span>
                                ) : (
                                    "Continue"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
