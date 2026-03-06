import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Mail, ArrowRight, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'

export default function SignIn() {
    const { user, signIn } = useAuth()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Already signed in — redirect to dashboard
    if (user) return <Navigate to="/" replace />

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        const result = await signIn(email.trim())
        if (!result.success) {
            setError(result.error || 'Sign in failed')
        }

        setIsSubmitting(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-6">
                {/* Brand */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                        <FileText size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">CollabNotes</h1>
                    <p className="text-sm text-muted-foreground text-center">
                        Collaborative note-taking, simplified
                    </p>
                </div>

                {/* Sign In Card */}
                <Card>
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-lg">Welcome back</CardTitle>
                        <CardDescription>Enter your email to sign in</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setError('')
                                    }}
                                    className="pl-9"
                                    required
                                    autoFocus
                                    disabled={isSubmitting}
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-destructive text-center">{error}</p>
                            )}

                            <Button type="submit" className="w-full gap-2" disabled={isSubmitting || !email.trim()}>
                                {isSubmitting ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <ArrowRight size={16} />
                                )}
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground">
                    No account?{' '}
                    <span className="text-foreground font-medium">Ask your team admin to create one</span>
                </p>
            </div>
        </div>
    )
}
