'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <header className="border-b bg-black shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Nexus-Education
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/courses" 
              className={`text-white hover:text-primary-400 transition ${pathname === '/courses' ? 'text-primary-400 font-semibold' : ''}`}
            >
              Courses
            </Link>
            {session && (
              <>
                <Link 
                  href="/my-learning" 
                  className={`text-white hover:text-primary-400 transition ${pathname === '/my-learning' ? 'text-primary-400 font-semibold' : ''}`}
                >
                  My Learning
                </Link>
                <Link 
                  href="/instructor/courses" 
                  className={`text-white hover:text-primary-400 transition ${pathname?.startsWith('/instructor') ? 'text-primary-400 font-semibold' : ''}`}
                >
                  Teach
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 text-white hover:text-primary-400"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                    {session.user.name?.[0] || session.user.email[0].toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{session.user.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm border border-gray-600 text-white rounded-lg hover:bg-gray-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="px-4 py-2 text-sm text-white hover:text-primary-400"
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
