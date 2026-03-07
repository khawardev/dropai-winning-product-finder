'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Zap, Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { signIn } from '@/lib/auth-client'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn.email({
      email,
      password,
    })

    if (result.error) {
      setError(result.error.message || 'Invalid email or password')
      setIsLoading(false)
      return
    }

    router.push(redirect)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden selection:bg-primary/30">
      {/* Abstract Glowing Backgrounds */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in duration-500">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-1 group">
            <img src="https://i.ibb.co/fJSBXLF/714d2bd0-4e86-4ac9-8720-9bdae9ab297b-removalai-preview.png" alt="DropAI Logo" className="w-10 h-10 object-contain transition-transform group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            <span className="text-2xl font-bold tracking-tight text-foreground">DropAI</span>
          </Link>
        </div>
        
        <div className="relative">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 rounded-2xl blur-xl opacity-50 -z-10" />
          
          <Card className="bg-card/80 border-border shadow-2xl backdrop-blur-xl rounded-2xl">
            <CardHeader className="space-y-1 text-center pb-6">
              <CardTitle className="text-3xl font-bold text-foreground tracking-tight">Welcome back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your details below to sign in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com" 
                      className="pl-10 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary transition-all rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="pl-10 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary transition-all rounded-xl"
                      required
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <button type="button" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Forgot password?
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl border border-primary/20 rounded-xl mt-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:text-primary/80 font-semibold hover:underline underline-offset-4 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
