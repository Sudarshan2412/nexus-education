"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Clock, FileText, BookOpen, ArrowRight } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  duration?: number | null;
  order?: number | null;
}

interface CourseLearnClientProps {
  courseId: string;
  courseTitle: string;
  videos: VideoItem[];
  materials: {
    id: string;
    title: string;
    url: string;
    type: string | null;
    size: number | null;
  }[];
  exercises: {
    id: string;
    title: string;
    type: string | null;
    points: number | null;
    question?: string | null;
    options?: Record<string, string> | null;
  }[];
}

export function CourseLearnClient({
  courseId,
  courseTitle,
  videos,
  materials,
  exercises,
}: CourseLearnClientProps) {
  const [activeId, setActiveId] = useState<string | null>(
    videos[0]?.id || null,
  );

  const activeVideo = useMemo(
    () => videos.find((v) => v.id === activeId) || null,
    [videos, activeId],
  );

  return (
    <div className="space-y-6">
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
              {videos.length ? "Now Playing" : "Course Overview"}
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">
              {courseTitle}
            </h1>
            {activeVideo && (
              <p className="text-sm text-muted-foreground mt-1">
                {activeVideo?.title}
              </p>
            )}
          </div>
        </div>
        {activeVideo ? (
          <div className="rounded-2xl overflow-hidden border border-border/60 bg-black">
            <video
              key={activeVideo.id}
              src={activeVideo.url}
              controls
              className="w-full h-[220px] sm:h-[360px] bg-black"
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-secondary/20 p-6 text-center text-muted-foreground">
            No videos available yet. Check materials below and try the exercises link.
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Play className="w-4 h-4 text-primary" />
            <h2 className="text-sm uppercase tracking-widest font-bold text-muted-foreground">
              Lessons
            </h2>
          </div>
          {videos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No videos yet.</p>
          ) : (
            <div className="space-y-2">
              {videos.map((video, idx) => {
                const isActive = video.id === activeId;
                return (
                  <motion.button
                    key={video.id}
                    whileHover={{ scale: 1.01 }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isActive
                        ? "border-primary/60 bg-primary/5"
                        : "border-border/40 hover:border-border/80 bg-secondary/20"
                    }`}
                    onClick={() => setActiveId(video.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Play className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {idx + 1}. {video.title}
                        </p>
                        {video.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {video.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground mt-2">
                          {typeof video.duration === "number" &&
                            video.duration > 0 && (
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {video.duration}m
                              </span>
                            )}
                          {typeof video.order === "number" && (
                            <span>Order {video.order}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="text-sm uppercase tracking-widest font-bold text-muted-foreground">
              Materials
            </h2>
          </div>
          {materials.length === 0 ? (
            <p className="text-sm text-muted-foreground">No materials yet.</p>
          ) : (
            <div className="space-y-2">
              {materials.map((mat) => (
                <a
                  key={mat.id}
                  href={mat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border border-border/50 hover:border-primary/60 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {mat.title}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                        {mat.type || "FILE"}
                      </p>
                    </div>
                    {mat.size && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {(mat.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h2 className="text-sm uppercase tracking-widest font-bold text-muted-foreground">
              Exercises
            </h2>
          </div>
          {exercises.length === 0 ? (
            <p className="text-sm text-muted-foreground">No exercises yet.</p>
          ) : (
            <Link
              href={`/courses/${courseId}/learn/exercises`}
              className="block p-4 rounded-lg border border-border/50 hover:border-primary/60 hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Go to exercises
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {exercises.length} question{exercises.length === 1 ? "" : "s"}
                  </p>
                  <div className="space-y-1">
                    {exercises.slice(0, 3).map((ex) => (
                      <p
                        key={ex.id}
                        className="text-sm text-muted-foreground line-clamp-2"
                      >
                        {ex.question || ex.title || "Exercise"}
                      </p>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-primary mt-1" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
