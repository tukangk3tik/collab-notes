import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
    id: string
    name: string
    email: string
    created_at: string
}

interface AuthContextType {
    user: User | null
    signIn: (email: string) => Promise<{ success: boolean; error?: string }>
    signOut: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const API_BASE = import.meta.env.VITE_API_KEY;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Restore session from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('collab-notes-user')
        if (stored) {
            try {
                setUser(JSON.parse(stored))
            } catch {
                localStorage.removeItem('collab-notes-user')
            }
        }
        setIsLoading(false)
    }, [])

    const signIn = async (email: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            if (!res.ok) {
                const data = await res.json()
                return { success: false, error: data.error || 'Sign in failed' }
            }

            const userData: User = await res.json()
            setUser(userData)
            localStorage.setItem('collab-notes-user', JSON.stringify(userData))
            return { success: true }
        } catch {
            return { success: false, error: 'Unable to connect to server' }
        }
    }

    const signOut = () => {
        setUser(null)
        localStorage.removeItem('collab-notes-user')
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
