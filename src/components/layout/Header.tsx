'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { GraduationCap, Menu, X, LogOut, User, BookOpen, Search } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/search', label: 'Search', icon: Search },
    { href: '/courses', label: 'Courses', icon: BookOpen },
    { href: '/my-learning', label: 'My Learning', icon: GraduationCap },
  ]

  if (session?.user?.role === 'INSTRUCTOR' || session?.user?.role === 'ADMIN') {
    navLinks.push({ href: '/instructor/courses', label: 'Teach', icon: GraduationCap })
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <span className="font-display font-bold text-xl uppercase tracking-tight hidden sm:block text-primary">
              Nexus Edu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-full font-display font-bold uppercase text-sm tracking-wider
                    transition-all duration-300
                    ${isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                      layoutId="activeNav"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary border border-border/50 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="font-display font-bold text-sm uppercase tracking-wider">
                    {session.user?.name || 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-display font-bold text-sm uppercase tracking-wider">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="hidden md:block px-4 py-2 rounded-full font-display font-bold text-sm uppercase tracking-wider border border-border/50 hover:bg-secondary/50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="hidden md:block px-4 py-2 rounded-full font-display font-bold text-sm uppercase tracking-wider bg-primary text-primary-foreground button-glow"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-border/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-display font-bold uppercase text-sm tracking-wider
                      ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}
                    `}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                )
              })}

              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-display font-bold uppercase text-sm tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-display font-bold uppercase text-sm tracking-wider text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg font-display font-bold uppercase text-sm tracking-wider text-center border border-border/50 hover:bg-secondary/50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg font-display font-bold uppercase text-sm tracking-wider text-center bg-primary text-primary-foreground button-glow"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
