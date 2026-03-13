'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Zap, Mail, Lock } from 'lucide-react'
import { Spinner, ButtonSpinner } from '@/components/Spinner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { signIn } from '@/lib/auth-client'
import { Logo } from '@/components/Logo'
import BlurFade from '@/components/ui/BlurFade'

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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden selection:bg-brand-blue/30">
      {/* Abstract Glowing Backgrounds */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-cyan/10 blur-[120px]" />
      </div>

      <BlurFade className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-10">
          <Logo textClassName="text-2xl" />
        </div>

        <div className="relative">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-0.5 bg-linear-to-r from-brand-blue/20 to-brand-cyan/20 rounded-2xl blur-2xl opacity-50 -z-10" />

          <Card className="bg-transparent border-none">
            <CardHeader className="space-y-1 text-center pb-8 pt-8">
              <CardTitle className="text-3xl font-medium text-foreground tracking-tight">Welcome back</CardTitle>
              <CardDescription className="text-muted-foreground pt-1">
                Enter your details to sign in
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <BlurFade>
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  </BlurFade>
                )}
                <div className="space-y-4">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    icon={<Mail className='size-4' />}
                    required
                  />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    icon={<Lock className='size-4'/>}
                    required
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <Button variant="link" size="sm" type="button" className="text-muted-foreground hover:text-brand-blue p-0">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  size="xl"
                  shape="xl"
                  glow
                  className="w-full font-medium"
                >
                  {isLoading ? <ButtonSpinner>Signing In...</ButtonSpinner> : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-brand-blue hover:text-brand-cyan font-medium transition-all">
            Join DropAI
          </Link>
        </p>
      </BlurFade>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Spinner />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
