'use client'

import { motion } from 'framer-motion'
import { Check, Play } from 'lucide-react'

interface ProgressTrackerProps {
    totalVideos: number
    completedVideos: number
    progressPercentage: number
    className?: string
}

export function ProgressTracker({
    totalVideos,
    completedVideos,
    progressPercentage,
    className = ''
}: ProgressTrackerProps) {
    return (
        <div className={`glass-card p-6 ${className}`}>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-foreground">
                        Course Progress
                    </h3>
                    <span className="text-2xl font-display font-bold text-primary">
                        {Math.round(progressPercentage)}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-neon-green rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-neon-green" />
                        <span>{completedVideos} completed</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Play className="w-4 h-4 text-primary" />
                        <span>{totalVideos - completedVideos} remaining</span>
                    </div>
                </div>

                {/* Completion Badge */}
                {progressPercentage === 100 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 bg-neon-green/10 border border-neon-green/30 rounded-lg text-center"
                    >
                        <span className="font-display font-bold text-neon-green text-sm uppercase tracking-wider">
                            🎉 Course Completed!
                        </span>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
