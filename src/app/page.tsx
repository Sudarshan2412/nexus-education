import Link from 'next/link'
import { Header } from '@/components/Header'
import { CourseCard } from '@/components/CourseCard'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-5xl font-bold mb-4">
            Learn Without Limits
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Access thousands of courses, code repositories, and learning materials
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/courses" 
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Browse Courses
            </Link>
            <Link 
              href="/auth/signin" 
              className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course cards will be populated dynamically */}
            <div className="text-center text-gray-500 col-span-full py-12">
              No courses available yet. Create your first course!
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Web Development', 'Data Science', 'Mobile Apps', 'Cloud Computing'].map((category) => (
              <Link
                key={category}
                href={`/courses?category=${category}`}
                className="p-6 border rounded-lg hover:shadow-lg transition text-center"
              >
                <h3 className="font-semibold">{category}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
