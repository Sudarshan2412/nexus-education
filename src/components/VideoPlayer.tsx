'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Video {
  id: string
  title: string
  url: string
  duration?: number | null
}

interface VideoPlayerProps {
  video: Video
  courseId: string
  initialWatchTime: number
  isCompleted: boolean
}

export function VideoPlayer({ video, courseId, initialWatchTime, isCompleted }: VideoPlayerProps) {
  const [completed, setCompleted] = useState(isCompleted)
  const [currentTime, setCurrentTime] = useState(initialWatchTime)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout>()
  const router = useRouter()

  useEffect(() => {
    // Start from last watched position
    if (videoRef.current && initialWatchTime > 0) {
      videoRef.current.currentTime = initialWatchTime
    }
  }, [initialWatchTime])

  useEffect(() => {
    // Track progress every 5 seconds
    progressIntervalRef.current = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const time = Math.floor(videoRef.current.currentTime)
        setCurrentTime(time)
        updateProgress(time, false)
      }
    }, 5000)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const updateProgress = async (watchTime: number, isCompleted: boolean) => {
    try {
      await fetch(`/api/courses/${courseId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: video.id,
          watchTime: watchTime,
          completed: isCompleted
        })
      })

      if (isCompleted && !completed) {
        setCompleted(true)
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = Math.floor(videoRef.current.currentTime)
      setCurrentTime(time)
    }
  }

  const handleVideoEnd = () => {
    if (videoRef.current) {
      const time = Math.floor(videoRef.current.duration)
      updateProgress(time, true)
    }
  }

  const handleVideoProgress = () => {
    if (videoRef.current && video.duration) {
      const percentWatched = (videoRef.current.currentTime / (video.duration * 60)) * 100
      
      // Mark as completed if watched 90% or more
      if (percentWatched >= 90 && !completed) {
        updateProgress(Math.floor(videoRef.current.currentTime), true)
      }
    }
  }

  return (
    <div className="relative bg-black aspect-video">
      <video
        ref={videoRef}
        src={video.url}
        controls
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onProgress={handleVideoProgress}
      >
        Your browser does not support the video tag.
      </video>
      
      {completed && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
          ✓ Completed
        </div>
      )}
    </div>
  )
}
