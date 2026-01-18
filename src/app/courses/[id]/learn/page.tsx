import { notFound, redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { VideoPlayer } from '@/components/VideoPlayer'
import { ProgressBar } from '@/components/ProgressBar'

export const dynamic = 'force-dynamic'

export default async function LearnPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { video?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      instructor: {
        select: { name: true }
      },
      videos: {
        orderBy: { order: 'asc' }
      },
      enrollments: {
        where: { userId: session.user.id },
        include: {
          videoProgress: true
        }
      }
    }
  })

  if (!course) {
    notFound()
  }

  const enrollment = course.enrollments[0]

  if (!enrollment) {
    redirect(`/courses/${params.id}`)
  }

  // Get current video (from query param or first video)
  const currentVideoId = searchParams.video || course.videos[0]?.id
  const currentVideo = course.videos.find(v => v.id === currentVideoId) || course.videos[0]

  if (!currentVideo) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>No videos available for this course yet.</p>
        </div>
      </main>
    )
  }

  // Get progress for current video
  const videoProgress = enrollment.videoProgress.find(vp => vp.videoId === currentVideo.id)

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
          <ProgressBar progress={enrollment.progress} />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <VideoPlayer
                video={currentVideo}
                courseId={course.id}
                initialWatchTime={videoProgress?.watchTime || 0}
                isCompleted={videoProgress?.completed || false}
              />
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                {currentVideo.description && (
                  <p className="text-gray-600 mb-4">{currentVideo.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By {course.instructor.name}</span>
                  {currentVideo.duration && (
                    <>
                      <span>•</span>
                      <span>{currentVideo.duration} minutes</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h3 className="font-bold mb-4">Course Content</h3>
              <div className="space-y-2">
                {course.videos.map((video, index) => {
                  const progress = enrollment.videoProgress.find(vp => vp.videoId === video.id)
                  const isCurrentVideo = video.id === currentVideo.id
                  
                  return (
                    <a
                      key={video.id}
                      href={`/courses/${course.id}/learn?video=${video.id}`}
                      className={`block p-3 rounded-lg hover:bg-gray-50 transition ${
                        isCurrentVideo ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          progress?.completed
                            ? 'bg-green-500 text-white'
                            : isCurrentVideo
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {progress?.completed ? '✓' : index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isCurrentVideo ? 'text-primary-600' : 'text-gray-900'
                          }`}>
                            {video.title}
                          </p>
                          {video.duration && (
                            <p className="text-xs text-gray-500">{video.duration}m</p>
                          )}
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
