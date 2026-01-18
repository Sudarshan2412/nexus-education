'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Code, Database, Sparkles, Cloud, Palette, Shield, Cpu, Smartphone } from 'lucide-react'

const categories = [
    {
        name: 'Web Development',
        description: 'Master HTML, CSS, JavaScript, React, and modern frameworks to build stunning websites.',
        icon: Code,
        color: 'neon-cyan',
        courses: 2500
    },
    {
        name: 'Data Science',
        description: 'Learn Python, machine learning, data visualization, and analytics to unlock insights.',
        icon: Database,
        color: 'neon-green',
        courses: 1800
    },
    {
        name: 'AI & Machine Learning',
        description: 'Explore neural networks, deep learning, and cutting-edge AI technologies.',
        icon: Sparkles,
        color: 'neon-purple',
        courses: 1200
    },
    {
        name: 'Cloud Computing',
        description: 'Master AWS, Azure, Google Cloud, and DevOps practices for scalable solutions.',
        icon: Cloud,
        color: 'neon-orange',
        courses: 950
    },
    {
        name: 'UI/UX Design',
        description: 'Create beautiful, user-centered designs with Figma, Adobe XD, and design thinking.',
        icon: Palette,
        color: 'neon-pink',
        courses: 800
    },
    {
        name: 'Cybersecurity',
        description: 'Protect systems with ethical hacking, penetration testing, and security protocols.',
        icon: Shield,
        color: 'neon-cyan',
        courses: 650
    },
    {
        name: 'Hardware & IoT',
        description: 'Build connected devices with Arduino, Raspberry Pi, and embedded systems.',
        icon: Cpu,
        color: 'neon-green',
        courses: 420
    },
    {
        name: 'Mobile Development',
        description: 'Create iOS and Android apps with Swift, Kotlin, React Native, and Flutter.',
        icon: Smartphone,
        color: 'neon-purple',
        courses: 1100
    }
]

const colorClasses: Record<string, { bg: string, text: string, border: string, glow: string }> = {
    'neon-cyan': {
        bg: 'bg-neon-cyan/10',
        text: 'text-neon-cyan',
        border: 'border-neon-cyan/30',
        glow: 'shadow-[0_0_80px_hsl(187,100%,50%,0.4)]'
    },
    'neon-green': {
        bg: 'bg-neon-green/10',
        text: 'text-neon-green',
        border: 'border-neon-green/30',
        glow: 'shadow-[0_0_80px_hsl(142,76%,50%,0.4)]'
    },
    'neon-purple': {
        bg: 'bg-neon-purple/10',
        text: 'text-neon-purple',
        border: 'border-neon-purple/30',
        glow: 'shadow-[0_0_80px_hsl(280,100%,60%,0.4)]'
    },
    'neon-orange': {
        bg: 'bg-neon-orange/10',
        text: 'text-neon-orange',
        border: 'border-neon-orange/30',
        glow: 'shadow-[0_0_80px_hsl(25,100%,55%,0.4)]'
    },
    'neon-pink': {
        bg: 'bg-neon-pink/10',
        text: 'text-neon-pink',
        border: 'border-neon-pink/30',
        glow: 'shadow-[0_0_80px_hsl(330,100%,60%,0.4)]'
    },
}

export function Categories() {
    return (
        <section id="categories" className="relative py-24">
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
                            Explore Topics
                        </span>
                    </motion.div>

                    <motion.h2
                        className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tighter text-foreground mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Popular Categories
                    </motion.h2>
                </div>

                {/* Vertical Slides */}
                <div className="space-y-12">
                    {categories.map((category, index) => {
                        const colors = colorClasses[category.color] || colorClasses['neon-cyan']

                        return (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{
                                    duration: 0.6,
                                    ease: "easeOut"
                                }}
                            >
                                <Link
                                    href={`/courses?category=${category.name}`}
                                    className={`glass-card p-8 md:p-10 block ${colors.glow} ${colors.border} border-2 hover:scale-[1.02] transition-transform`}
                                >
                                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                        {/* Icon */}
                                        <motion.div
                                            className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl ${colors.bg} ${colors.border} border-2 flex items-center justify-center relative flex-shrink-0`}
                                            whileInView={{
                                                rotate: [0, 8, -8, 0],
                                                scale: [0.85, 1, 1]
                                            }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.7, delay: 0.1 }}
                                        >
                                            <category.icon className={`w-12 h-12 md:w-14 md:h-14 ${colors.text}`} />

                                            {/* Orbiting glow */}
                                            <motion.div
                                                className={`absolute inset-0 ${colors.bg} rounded-2xl`}
                                                animate={{
                                                    scale: [1, 1.4, 1],
                                                    opacity: [0.6, 0, 0.6]
                                                }}
                                                transition={{
                                                    duration: 2.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        </motion.div>

                                        {/* Content */}
                                        <div className="flex-1 text-center md:text-left">
                                            {/* Number */}
                                            <motion.span
                                                className={`inline-block text-xs font-display font-bold ${colors.text} mb-1 opacity-50`}
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 0.5 }}
                                                viewport={{ once: true }}
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </motion.span>

                                            <motion.h3
                                                className={`font-display font-bold text-2xl md:text-3xl mb-2 uppercase tracking-tight ${colors.text}`}
                                                initial={{ opacity: 0, y: 15 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.15 }}
                                            >
                                                {category.name}
                                            </motion.h3>

                                            <motion.p
                                                className="text-base md:text-lg text-muted-foreground leading-relaxed"
                                                initial={{ opacity: 0, y: 15 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.25 }}
                                            >
                                                {category.description}
                                            </motion.p>
                                        </div>

                                        {/* Course count */}
                                        <motion.div
                                            className={`flex flex-col items-center px-6 py-4 ${colors.bg} ${colors.border} border rounded-2xl flex-shrink-0`}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <span className={`font-display font-bold text-2xl md:text-3xl ${colors.text}`}>
                                                {category.courses.toLocaleString()}+
                                            </span>
                                            <span className="text-muted-foreground text-xs uppercase tracking-wider">
                                                Courses
                                            </span>
                                        </motion.div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
