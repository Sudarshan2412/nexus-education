import Link from 'next/link'
import Image from 'next/image'
import { ProgressBar } from './ProgressBar'

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
  progress?: number
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
  progress
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-48 bg-gray-200">
          {thumbnail ? (
            <Image 
              src={thumbnail} 
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
              {category}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {level}
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          
          {progress !== undefined && (
            <div className="mb-3">
              <ProgressBar progress={progress} showLabel={false} />
              <p className="text-xs text-gray-500 mt-1">{progress.toFixed(0)}% complete</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{instructor.name}</span>
            <span className="font-bold text-primary-600">
              {price === 0 ? 'Free' : `$${price}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
