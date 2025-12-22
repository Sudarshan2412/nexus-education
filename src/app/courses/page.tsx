import { Header } from '@/components/Header'
import { CourseCard } from '@/components/CourseCard'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      instructor: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Courses</h1>
          <p className="text-gray-600">Explore our collection of courses</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <select className="px-4 py-2 border rounded-lg">
            <option value="">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Mobile Apps">Mobile Apps</option>
            <option value="Cloud Computing">Cloud Computing</option>
          </select>
          
          <select className="px-4 py-2 border rounded-lg">
            <option value="">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>

          <select className="px-4 py-2 border rounded-lg">
            <option value="">Sort By</option>
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course: any) => (
              <CourseCard key={course.id} {...course} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No courses available yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
