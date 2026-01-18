'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { CourseCard } from '@/components/CourseCard'
import { UserCard } from '@/components/UserCard'
import axios from 'axios'

type SearchType = 'courses' | 'people'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  category: string
  price: number
  level: string
  instructor: {
    name: string | null
    id: string
  }
  _count: {
    enrollments: number
  }
}

interface User {
  id: string
  name: string | null
  email: string
  skills: string[]
  _count: {
    coursesCreated: number
    enrollments: number
  }
}

export default function SearchPage() {
  const [searchType, setSearchType] = useState<SearchType>('courses')
  const [query, setQuery] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch()
      } else {
        setCourses([])
        setUsers([])
        setHasSearched(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query, searchType])

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setHasSearched(true)

    try {
      if (searchType === 'courses') {
        const response = await axios.get(`/api/search/courses?q=${encodeURIComponent(query)}`)
        setCourses(response.data.courses)
      } else {
        const response = await axios.get(`/api/search/people?q=${encodeURIComponent(query)}`)
        setUsers(response.data.users)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Search</h1>

        {/* Search Type Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setSearchType('courses')
              setCourses([])
              setUsers([])
              setHasSearched(false)
            }}
            className={`px-6 py-3 font-medium transition border-b-2 ${
              searchType === 'courses'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => {
              setSearchType('people')
              setCourses([])
              setUsers([])
              setHasSearched(false)
            }}
            className={`px-6 py-3 font-medium transition border-b-2 ${
              searchType === 'people'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            People
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder={
              searchType === 'courses'
                ? 'Search for courses by title, description, category, or instructor...'
                : 'Search for people by name, email, or skills...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <>
            {searchType === 'courses' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Found
                </h2>
                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <CourseCard key={course.id} {...course} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                    No courses found matching &quot;{query}&quot;
                  </div>
                )}
              </div>
            )}

            {searchType === 'people' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  {users.length} {users.length === 1 ? 'Person' : 'People'} Found
                </h2>
                {users.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                      <UserCard key={user.id} {...user} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                    No people found matching &quot;{query}&quot;
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !hasSearched && (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-xl">
              Start typing to search for {searchType === 'courses' ? 'courses' : 'people'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
