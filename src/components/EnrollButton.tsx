'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EnrollButtonProps {
  courseId: string
  isEnrolled?: boolean
}

export function EnrollButton({ courseId, isEnrolled = false }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEnroll = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        router.refresh()
      } else {
        alert(data.error || 'Failed to enroll')
      }
    } catch (error) {
      console.error('Enrollment error:', error)
      alert('Failed to enroll in course')
    } finally {
      setLoading(false)
    }
  }

  const handleUnenroll = async () => {
    if (!confirm('Are you sure you want to unenroll from this course?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        router.refresh()
      } else {
        alert(data.error || 'Failed to unenroll')
      }
    } catch (error) {
      console.error('Unenrollment error:', error)
      alert('Failed to unenroll from course')
    } finally {
      setLoading(false)
    }
  }

  if (isEnrolled) {
    return (
      <button
        onClick={handleUnenroll}
        disabled={loading}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Unenroll'}
      </button>
    )
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : 'Enroll Now'}
    </button>
  )
}
