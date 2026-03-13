'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Mail, Lock, User } from 'lucide-react'
import { ButtonSpinner } from '@/components/Spinner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { signUp } from '@/lib/auth-client'
import { Logo } from '@/components/Logo'
import BlurFade from '@/components/ui/BlurFade'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    const result = await signUp.email({
      email,
      password,
      name,
    })

    if (result.error) {
      setError(result.error.message || 'Failed to create account')
      setIsLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen  text-foreground flex items-center justify-center p-4 relative overflow-hidden selection:bg-brand-blue/30">
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

          <Card className="bg-transparent shadow-none border-none">
            <CardHeader className="space-y-1 text-center pb-8 pt-8">
              <CardTitle className="text-3xl font-medium text-foreground tracking-tight">Create an account</CardTitle>
              <CardDescription className="text-muted-foreground pt-1">
                Enter your details to get started with DropAI
              </CardDescription>
            </CardHeader>
            <CardContent >
              <form onSubmit={handleSignup} className="space-y-4">
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
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    icon={<User className="size-4" />}
                    required
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    icon={<Mail className="size-4" />}
                    required
                  />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min 8 characters)"
                    icon={<Lock className="size-4" />}
                    required
                    minLength={8}
                  />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    icon={<Lock className="size-4" />}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  size="xl"
                  shape="xl"
                  glow
                  className="w-full mt-9 "
                >
                  {isLoading ? <ButtonSpinner>Creating Account</ButtonSpinner> : 'Create Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-blue hover:text-brand-cyan font-medium transition-all">
            Sign In
          </Link>
        </p>
      </BlurFade>
    </div>
  )
}
