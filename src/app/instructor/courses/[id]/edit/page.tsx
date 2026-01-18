'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'

interface Video {
  id: string
  title: string
  description?: string | null
  url: string
  duration?: number | null
  order: number
}

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: string
  price: number
  thumbnail?: string | null
  published: boolean
  videos: Video[]
}

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [course, setCourse] = useState<Course | null>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'content'>('details')
  const [showVideoForm, setShowVideoForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    url: '',
    duration: '',
    order: 1
  })

  useEffect(() => {
    fetchCourse()
  }, [params.id])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setCourse(data.course)
      } else {
        alert(data.error || 'Failed to fetch course')
        router.push('/instructor/courses')
      }
    } catch (error) {
      console.error('Course fetch error:', error)
      alert('Failed to fetch course')
    } finally {
      setLoading(false)
    }
  }

  const handleCourseUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!course) return

    setSaving(true)
    try {
      const response = await fetch(`/api/courses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      })

      const data = await response.json()

      if (response.ok) {
        alert('Course updated successfully!')
        setCourse(data.course)
      } else {
        alert(data.error || 'Failed to update course')
      }
    } catch (error) {
      console.error('Course update error:', error)
      alert('Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCourse = async () => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/courses/${params.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Course deleted successfully')
        router.push('/instructor/courses')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete course')
      }
    } catch (error) {
      console.error('Course deletion error:', error)
      alert('Failed to delete course')
    }
  }

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingVideo) {
        // Update video
        const response = await fetch(`/api/courses/${params.id}/videos/${editingVideo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...videoForm,
            duration: videoForm.duration ? parseInt(videoForm.duration) : null
          })
        })

        if (response.ok) {
          alert('Video updated successfully!')
          fetchCourse()
          resetVideoForm()
        } else {
          const data = await response.json()
          alert(data.error || 'Failed to update video')
        }
      } else {
        // Add new video
        const response = await fetch(`/api/courses/${params.id}/videos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...videoForm,
            duration: videoForm.duration ? parseInt(videoForm.duration) : null
          })
        })

        if (response.ok) {
          alert('Video added successfully!')
          fetchCourse()
          resetVideoForm()
        } else {
          const data = await response.json()
          alert(data.error || 'Failed to add video')
        }
      }
    } catch (error) {
      console.error('Video operation error:', error)
      alert('Failed to save video')
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return
    }

    try {
      const response = await fetch(`/api/courses/${params.id}/videos/${videoId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Video deleted successfully')
        fetchCourse()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete video')
      }
    } catch (error) {
      console.error('Video deletion error:', error)
      alert('Failed to delete video')
    }
  }

  const resetVideoForm = () => {
    setVideoForm({
      title: '',
      description: '',
      url: '',
      duration: '',
      order: course?.videos.length ? course.videos.length + 1 : 1
    })
    setEditingVideo(null)
    setShowVideoForm(false)
  }

  const startEditVideo = (video: Video) => {
    setVideoForm({
      title: video.title,
      description: video.description || '',
      url: video.url,
      duration: video.duration?.toString() || '',
      order: video.order
    })
    setEditingVideo(video)
    setShowVideoForm(true)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  if (!course) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">{course.title}</h1>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded text-sm ${
                  course.published 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {course.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push('/instructor/courses')}
              className="text-primary-600 hover:text-primary-700"
            >
              ← Back to courses
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex gap-8 px-6">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 border-b-2 font-medium ${
                    activeTab === 'details'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Course Details
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`py-4 border-b-2 font-medium ${
                    activeTab === 'content'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Content ({course.videos.length} videos)
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'details' && (
                <form onSubmit={handleCourseUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      value={course.title}
                      onChange={(e) => setCourse({...course, title: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={course.description}
                      onChange={(e) => setCourse({...course, description: e.target.value})}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <input
                        type="text"
                        value={course.category}
                        onChange={(e) => setCourse({...course, category: e.target.value})}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level
                      </label>
                      <select
                        value={course.level}
                        onChange={(e) => setCourse({...course, level: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (USD)
                      </label>
                      <input
                        type="number"
                        value={course.price}
                        onChange={(e) => setCourse({...course, price: parseFloat(e.target.value) || 0})}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Published
                      </label>
                      <select
                        value={course.published ? 'true' : 'false'}
                        onChange={(e) => setCourse({...course, published: e.target.value === 'true'})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="false">Draft</option>
                        <option value="true">Published</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      value={course.thumbnail || ''}
                      onChange={(e) => setCourse({...course, thumbnail: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteCourse}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete Course
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'content' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Videos</h2>
                    <button
                      onClick={() => setShowVideoForm(true)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Add Video
                    </button>
                  </div>

                  {showVideoForm && (
                    <form onSubmit={handleVideoSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold mb-4">
                        {editingVideo ? 'Edit Video' : 'Add New Video'}
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={videoForm.title}
                            onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={videoForm.description}
                            onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video URL *
                          </label>
                          <input
                            type="url"
                            value={videoForm.url}
                            onChange={(e) => setVideoForm({...videoForm, url: e.target.value})}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="https://example.com/video.mp4"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Duration (minutes)
                            </label>
                            <input
                              type="number"
                              value={videoForm.duration}
                              onChange={(e) => setVideoForm({...videoForm, duration: e.target.value})}
                              min="0"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Order
                            </label>
                            <input
                              type="number"
                              value={videoForm.order}
                              onChange={(e) => setVideoForm({...videoForm, order: parseInt(e.target.value)})}
                              min="1"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                          >
                            {editingVideo ? 'Update Video' : 'Add Video'}
                          </button>
                          <button
                            type="button"
                            onClick={resetVideoForm}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {course.videos.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No videos yet. Click &quot;Add Video&quot; to get started.
                      </p>
                    ) : (
                      course.videos.map((video) => (
                        <div key={video.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{video.order}. {video.title}</h4>
                              {video.description && (
                                <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                              )}
                              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                {video.duration && <span>{video.duration} minutes</span>}
                                <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                  View Video
                                </a>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => startEditVideo(video)}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteVideo(video.id)}
                                className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
