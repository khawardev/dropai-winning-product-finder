'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Mail, Lock, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { signUp } from '@/lib/auth-client'

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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden selection:bg-brand-blue/30">
      {/* Abstract Glowing Backgrounds */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-cyan/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center group">
            <img 
              src="https://i.ibb.co/fJSBXLF/714d2bd0-4e86-4ac9-8720-9bdae9ab297b-removalai-preview.png" 
              alt="DropAI Logo" 
              className="w-10 h-10 object-contain transition-all group-hover:scale-105" 
            />
            <span className="text-2xl font-bold tracking-tight text-foreground">DropAI</span>
          </Link>
        </div>
        
        <div className="relative">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-0.5 bg-linear-to-r from-brand-blue/20 to-brand-cyan/20 rounded-2xl blur-2xl opacity-50 -z-10" />
          
          <Card className="bg-none border-0 bg-transparent overflow-hidden">
            <CardHeader className="space-y-1 text-center pb-8 pt-8">
              <CardTitle className="text-3xl font-bold text-foreground tracking-tight">Create an account</CardTitle>
              <CardDescription className="text-muted-foreground pt-1">
                Enter your details to get started with DropAI
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                    <Zap className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                    <Input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name" 
                      className="pl-11 h-12 bg-muted/50 border-border hover:border-brand-blue/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-brand-blue/50 focus-visible:border-brand-blue transition-all rounded-xl"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                    <Input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address" 
                      className="pl-11 h-12 bg-muted/50 border-border hover:border-brand-blue/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-brand-blue/50 focus-visible:border-brand-blue transition-all rounded-xl"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                    <Input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (min 8 characters)" 
                      className="pl-11 h-12 bg-muted/50 border-border hover:border-brand-blue/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-brand-blue/50 focus-visible:border-brand-blue transition-all rounded-xl"
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand-blue transition-colors" />
                    <Input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password" 
                      className="pl-11 h-12 bg-muted/50 border-border hover:border-brand-blue/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-brand-blue/50 focus-visible:border-brand-blue transition-all rounded-xl"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:scale-[1.01] rounded-xl mt-6"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-blue hover:text-brand-cyan font-semibold transition-all">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
