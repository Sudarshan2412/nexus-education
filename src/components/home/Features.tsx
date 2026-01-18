'use client'

import { motion } from 'framer-motion'
import {
    PlayCircle, Upload, TrendingUp, Code,
    GitBranch, Trophy, MessageSquare, Award
} from 'lucide-react'

const features = [
    {
        title: 'Video Streaming',
        description: 'High-quality video lessons with seamless playback and progress tracking. Watch on any device with adaptive streaming quality.',
        icon: PlayCircle,
        color: 'neon-cyan',
    },
    {
        title: 'Easy Upload',
        description: 'Drag-and-drop video uploads with automatic processing and optimization. Support for all major video formats.',
        icon: Upload,
        color: 'neon-green',
    },
    {
        title: 'Progress Tracking',
        description: 'Track your learning journey with detailed analytics and achievements. Set goals and monitor your improvement.',
        icon: TrendingUp,
        color: 'neon-purple',
    },
    {
        title: 'Code Integration',
        description: 'Integrated code editor with syntax highlighting and live preview. Practice coding directly in your browser.',
        icon: Code,
        color: 'neon-orange',
    },
    {
        title: 'GitHub Sync',
        description: 'Connect repositories and track coding projects seamlessly. Push your work directly to GitHub.',
        icon: GitBranch,
        color: 'neon-pink',
    },
    {
        title: 'Interactive Exercises',
        description: 'Hands-on coding challenges and quizzes to reinforce learning. Get instant feedback on your solutions.',
        icon: Trophy,
        color: 'neon-cyan',
    },
    {
        title: 'Live Discussions',
        description: 'Engage with instructors and peers in real-time Q&A sessions. Build your professional network.',
        icon: MessageSquare,
        color: 'neon-green',
    },
    {
        title: 'Certificates',
        description: 'Earn verified certificates upon course completion to boost your career. Share on LinkedIn and resumes.',
        icon: Award,
        color: 'neon-purple',
    }
]

const colorClasses: Record<string, { bg: string, text: string, border: string, glow: string }> = {
    'neon-cyan': {
        bg: 'bg-neon-cyan/10',
        text: 'text-neon-cyan',
        border: 'border-neon-cyan/30',
        glow: 'shadow-[0_0_60px_hsl(187,100%,50%,0.3)]'
    },
    'neon-green': {
        bg: 'bg-neon-green/10',
        text: 'text-neon-green',
        border: 'border-neon-green/30',
        glow: 'shadow-[0_0_60px_hsl(142,76%,50%,0.3)]'
    },
    'neon-purple': {
        bg: 'bg-neon-purple/10',
        text: 'text-neon-purple',
        border: 'border-neon-purple/30',
        glow: 'shadow-[0_0_60px_hsl(280,100%,60%,0.3)]'
    },
    'neon-orange': {
        bg: 'bg-neon-orange/10',
        text: 'text-neon-orange',
        border: 'border-neon-orange/30',
        glow: 'shadow-[0_0_60px_hsl(25,100%,55%,0.3)]'
    },
    'neon-pink': {
        bg: 'bg-neon-pink/10',
        text: 'text-neon-pink',
        border: 'border-neon-pink/30',
        glow: 'shadow-[0_0_60px_hsl(330,100%,60%,0.3)]'
    },
}

export function Features() {
    return (
        <section id="features" className="relative py-24">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold uppercase tracking-widest text-primary mb-4">
                            Everything You Need
                        </span>
                    </motion.div>

                    <motion.h2
                        className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tighter text-foreground mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Powerful Features for
                        <span className="block gradient-text">Modern Learning</span>
                    </motion.h2>
                </div>

                {/* Vertical Slides */}
                <div className="space-y-16">
                    {features.map((feature, index) => {
                        const colors = colorClasses[feature.color] || colorClasses['neon-cyan']
                        const isEven = index % 2 === 0

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    duration: 0.7,
                                    ease: "easeOut"
                                }}
                                className={`glass-card p-8 md:p-12 ${colors.glow} ${colors.border} border-2`}
                            >
                                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}>
                                    {/* Icon */}
                                    <motion.div
                                        className={`w-28 h-28 md:w-36 md:h-36 rounded-3xl ${colors.bg} ${colors.border} border-2 flex items-center justify-center relative flex-shrink-0`}
                                        whileInView={{
                                            rotate: [0, 5, -5, 0],
                                            scale: [0.9, 1, 1]
                                        }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                    >
                                        <feature.icon className={`w-14 h-14 md:w-18 md:h-18 ${colors.text}`} />

                                        {/* Pulsing glow */}
                                        <motion.div
                                            className={`absolute inset-0 ${colors.bg} rounded-3xl`}
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.5, 0, 0.5]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </motion.div>

                                    {/* Content */}
                                    <div className={`text-center ${isEven ? 'md:text-left' : 'md:text-right'} flex-1`}>
                                        {/* Number indicator */}
                                        <motion.span
                                            className={`inline-block text-sm font-display font-bold ${colors.text} mb-2 opacity-60`}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 0.6 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {String(index + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
                                        </motion.span>

                                        <motion.h3
                                            className={`font-display font-bold text-2xl md:text-4xl mb-4 uppercase tracking-tight ${colors.text}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            {feature.title}
                                        </motion.h3>

                                        <motion.p
                                            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {feature.description}
                                        </motion.p>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
