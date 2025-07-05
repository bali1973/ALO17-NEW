'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Session context type
interface Session {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  expires: string
}

interface AuthContextType {
  session: Session | null
  setSession: (session: Session | null) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function Providers({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // localStorage'dan session'ı al
    const savedSession = localStorage.getItem('alo17-session')
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession)
        // Session'ın süresi dolmuş mu kontrol et
        if (new Date(sessionData.expires) > new Date()) {
          setSession(sessionData)
        } else {
          localStorage.removeItem('alo17-session')
        }
      } catch (error) {
        localStorage.removeItem('alo17-session')
      }
    }
    setIsLoading(false)
  }, [])

  const handleSetSession = (newSession: Session | null) => {
    setSession(newSession)
    if (newSession) {
      localStorage.setItem('alo17-session', JSON.stringify(newSession))
    } else {
      localStorage.removeItem('alo17-session')
    }
  }

  return (
    <AuthContext.Provider value={{ session, setSession: handleSetSession, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
} 