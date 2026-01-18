'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Sparkles } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { CourseCard } from '@/components/courses/CourseCard'

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [loading, setLoading] = useState(true)

  const categories = ['All', 'Web Development', 'Data Science', 'Mobile Apps', 'Cloud Computing', 'AI & Machine Learning']
  const levels = ['All', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses')
      const data = await res.json()
      setCourses(data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel
    return matchesSearch && matchesCategory && matchesLevel
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16 py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Explore Courses
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter text-foreground mb-4">
              Discover Your Next
              <span className="block gradient-text">Learning Adventure</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse through thousands of courses and find the perfect one for your journey
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="glass-card p-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-display"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex-1">
                <label className="block text-sm font-display font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  <Filter className="w-4 h-4 inline mr-2" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-display cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div className="flex-1">
                <label className="block text-sm font-display font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-display cursor-pointer"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground font-display">
                Found <span className="text-primary font-bold">{filteredCourses.length}</span> courses
              </p>
            </div>
          </motion.div>

          {/* Courses Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} {...course} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-20 glass-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
