'use client'

import React, { useState, useTransition, useEffect, Suspense } from 'react'
import {
  Search,
  Globe,
  Target,
  DollarSign,
  Truck,
  Layers,
  Zap,
  Loader2,
  CheckCircle2,
  Activity,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { searchProducts } from '@/server/actions/ProductSearch'
import Link from 'next/link'

export default function ProductFinder() {
  const [isSearching, setIsSearching] = useState(false)
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSearch = async (formData: FormData) => {
    setIsSearching(true)
    setProgress(0)
    setError(null)

    const steps = [
      { p: 20, s: 'Scanning global trends...' },
      { p: 45, s: 'Analyzing market demand...' },
      { p: 70, s: 'Calculating profit margins...' },
      { p: 90, s: 'Matching reliable suppliers...' },
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p)
        setStep(steps[currentStep].s)
        currentStep++
      }
    }, 3000)

    startTransition(async () => {
      try {
        const result = await searchProducts(formData)

        clearInterval(interval)
        setProgress(100)
        setStep('Finalizing winning products...')

        if (result.success) {
        setTimeout(() => {
          const url = (result as any).searchId ? `/dashboard/results?id=${(result as any).searchId}` : '/dashboard/results'
          router.push(url)
        }, 800)
        } else {
          setError('Search failed. Please try again.')
          setIsSearching(false)
        }
      } catch (err) {
        clearInterval(interval)
        setError('An unexpected error occurred. Please try again.')
        setIsSearching(false)
      }
    })
  }

  const [recentSearches, setRecentSearches] = useState<any[]>([])

  useEffect(() => {
    async function fetchRecent() {
      try {
        const response = await fetch('/api/search/recent')
        if (response.ok) {
          const data = await response.json()
          setRecentSearches(data)
        }
      } catch (err) {
        console.error('Failed to fetch recent searches')
      }
    }
    fetchRecent()
  }, [])

  return (
    <div className="mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Product Finder</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure your AI agents to find the perfect winning products for your store.</p>
      </div>
      {!isSearching ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <form action={handleSearch}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Search Parameters</CardTitle>
                  <CardDescription>Fill in the details below to start the AI analysis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Search className="w-4 h-4 text-primary" /> Niche Keyword
                      </label>
                      <Input name="niche" placeholder="e.g. Pet Tech, Home Office" className="bg-muted/50 border-border" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Globe className="w-4 h-4 text-secondary" /> Target Country
                      </label>
                      <select name="country" className="flex h-9 w-full rounded-md border border-border bg-muted/50 px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>Germany</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-400" /> Audience Type
                      </label>
                      <select name="audience" className="flex h-9 w-full rounded-md border border-border bg-muted/50 px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                        <option>General Consumer</option>
                        <option>Tech Enthusiasts</option>
                        <option>Pet Owners</option>
                        <option>Fitness Junkies</option>
                        <option>Home Decorators</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" /> Product Category
                      </label>
                      <select name="category" className="flex h-9 w-full rounded-md border border-border bg-muted/50 px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                        <option>All Categories</option>
                        <option>Electronics</option>
                        <option>Home & Garden</option>
                        <option>Beauty & Health</option>
                        <option>Toys & Hobbies</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500" /> Price Range ($)
                      </label>
                      <div className="flex gap-2">
                        <Input name="priceMin" type="number" placeholder="Min" className="bg-muted/50 border-border" />
                        <Input name="priceMax" type="number" placeholder="Max" className="bg-muted/50 border-border" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Truck className="w-4 h-4 text-rose-500" /> Shipping Limit (Days)
                      </label>
                      <Input name="shippingLimit" type="number" placeholder="e.g. 10" className="bg-muted/50 border-border" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-bold"
                          >
                            <Zap className="mr-2 w-5 h-5 fill-primary-foreground" /> Find Winning Products
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Start the AI analysis based on your parameters</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Recent Discoveries
                </CardTitle>
                <CardDescription>Jump back into your previous AI reports.</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-1">
                  {recentSearches.length > 0 ? (
                    recentSearches.map((search) => (
                      <Link 
                        key={search.id} 
                        href={`/dashboard/results?id=${search.id}`}
                        className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {search.niche}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {search.targetCountry} • {new Date(search.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center">
                      <p className="text-xs text-muted-foreground">No recent searches yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-6">
                <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 fill-primary" /> Pro Tip
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Narrowing your niche keywords (e.g., &quot;ergonomic office chairs&quot; instead of just &quot;chairs&quot;) helps our AI agents find more specific winning products with lower competition.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="bg-card border-border p-12 text-center space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
            <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">AI Agents at Work</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">{step}</p>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <Progress value={progress} className="h-2 bg-muted" />
            <p className="text-xs text-muted-foreground font-mono">{progress}% Complete</p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-4">
            {[
              { label: 'Trends', done: progress > 20 },
              { label: 'Profit', done: progress > 70 },
              { label: 'Suppliers', done: progress > 90 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 justify-center">
                <CheckCircle2 className={cn("w-4 h-4", item.done ? "text-emerald-500" : "text-muted")} />
                <span className={cn("text-xs font-medium", item.done ? "text-foreground" : "text-muted-foreground")}>{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
