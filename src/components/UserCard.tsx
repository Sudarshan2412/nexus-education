import Link from 'next/link'

interface UserCardProps {
  id: string
  name: string | null
  email: string
  skills: string[]
  _count: {
    coursesCreated: number
    enrollments: number
  }
}

export function UserCard({ id, name, email, skills, _count }: UserCardProps) {
  return (
    <Link
      href={`/profile/${id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {name?.[0] || email[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 truncate">{name || 'User'}</h3>
          <p className="text-sm text-gray-600 truncate">{email}</p>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              +{skills.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="flex gap-4 text-sm text-gray-600">
        <span>{_count.coursesCreated} courses created</span>
        <span>•</span>
        <span>{_count.enrollments} enrollments</span>
      </div>
    </Link>
  )
}
