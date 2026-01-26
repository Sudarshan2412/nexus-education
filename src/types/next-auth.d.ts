import 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
    credits?: number
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role?: string
      credits?: number
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    credits?: number
  }
}
