import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { loginRequest, registerRequest } from '../lib/api'

export type UserRole = 'user' | 'seller'

type Session = {
  id: string
  role: UserRole
  name: string
  email: string
  token: string
}

type AuthContextValue = {
  session: Session | null
  login: (input: {
    role: UserRole
    email: string
    password: string
  }) => Promise<void>
  register: (input: {
    role: UserRole
    name: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'amazon-shop-session'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Session
    if (parsed?.role && parsed?.name) return parsed
  } catch {
    return null
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readStoredSession())

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      login: async ({ role, email, password }) => {
        const data = await loginRequest({ role, email, password })
        const nextSession: Session = {
          id: data.user.id,
          role: data.user.role,
          name: data.user.name,
          email: data.user.email,
          token: data.token,
        }
        setSession(nextSession)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
      },
      register: async ({ role, name, email, password }) => {
        const data = await registerRequest({ role, name, email, password })
        const nextSession: Session = {
          id: data.user.id,
          role: data.user.role,
          name: data.user.name,
          email: data.user.email,
          token: data.token,
        }
        setSession(nextSession)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
      },
      logout: () => {
        setSession(null)
        localStorage.removeItem(STORAGE_KEY)
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
