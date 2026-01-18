'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GraduationCap, Clock, Users } from 'lucide-react'

interface CourseCardProps {
  id: string
  title: string
  description: string
  thumbnail?: string | null
  instructor: {
    name: string | null
  }
  category: string
  price: number
  level: string
  index?: number
}

const levelColors: Record<string, { bg: string, text: string, border: string }> = {
  'BEGINNER': { bg: 'bg-neon-green/10', text: 'text-neon-green', border: 'border-neon-green/30' },
  'INTERMEDIATE': { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  'ADVANCED': { bg: 'bg-neon-purple/10', text: 'text-neon-purple', border: 'border-neon-purple/30' },
}

export function CourseCard({
  id,
  title,
  description,
  thumbnail,
  instructor,
  category,
  price,
  level,
  index = 0
}: CourseCardProps) {
  const colors = levelColors[level.toUpperCase()] || levelColors['BEGINNER']

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link href={`/courses/${id}`} className="block h-full group">
        <div className="glass-card overflow-hidden h-full flex flex-col border-2 border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_60px_hsl(187,100%,50%,0.3)]">
          {/* Thumbnail */}
          <div className="relative h-48 bg-secondary/30 overflow-hidden">
            {thumbnail ? (
              <motion.img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-neon-purple/20">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <GraduationCap className="w-16 h-16 text-primary/50" />
                </motion.div>
              </div>
            )}

            {/* Price Badge */}
            <div className="absolute top-4 right-4">
              <motion.div
                className={`px-4 py-2 rounded-full font-display font-bold text-sm ${price === 0
                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                    : 'bg-primary/20 text-primary border border-primary/50'
                  } backdrop-blur-xl`}
                whileHover={{ scale: 1.1 }}
              >
                {price === 0 ? 'FREE' : `₹${price}`}
              </motion.div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-[10px] px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold uppercase tracking-widest"
              >
                {category}
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`text-[10px] px-3 py-1 border rounded-full font-bold uppercase tracking-widest ${colors.bg} ${colors.text} ${colors.border}`}
              >
                {level}
              </motion.span>
            </div>

            {/* Title */}
            <h3 className="font-display font-bold text-lg mb-2 text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
              {description || 'No description available'}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center shadow-[0_0_20px_hsl(187,100%,50%,0.3)]"
                >
                  <span className="text-xs text-primary-foreground font-bold">
                    {instructor.name?.charAt(0) || 'I'}
                  </span>
                </motion.div>
                <span className="text-xs text-muted-foreground font-medium">
                  {instructor.name || 'Instructor'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground text-xs">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  12h
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  234
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Glow Line */}
          <motion.div
            className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </Link>
    </motion.div>
  )
}
