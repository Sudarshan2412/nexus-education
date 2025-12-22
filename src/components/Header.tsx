'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            LMS
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/courses" 
              className={`hover:text-primary-600 transition ${pathname === '/courses' ? 'text-primary-600 font-semibold' : ''}`}
            >
              Courses
            </Link>
            {session && (
              <>
                <Link 
                  href="/my-learning" 
                  className={`hover:text-primary-600 transition ${pathname === '/my-learning' ? 'text-primary-600 font-semibold' : ''}`}
                >
                  My Learning
                </Link>
                {(session.user.role === 'INSTRUCTOR' || session.user.role === 'ADMIN') && (
                  <Link 
                    href="/instructor/courses" 
                    className={`hover:text-primary-600 transition ${pathname?.startsWith('/instructor') ? 'text-primary-600 font-semibold' : ''}`}
                  >
                    Teach
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 hover:text-primary-600"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                    {session.user.name?.[0] || session.user.email[0].toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{session.user.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="px-4 py-2 text-sm hover:text-primary-600"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
