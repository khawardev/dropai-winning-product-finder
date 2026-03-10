'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Filter,
  LayoutGrid,
  List,
  TrendingUp,
  DollarSign,
  Activity,
  Truck,
  Bookmark,
  ChevronRight,
  ArrowUpDown,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { getProductResults } from '@/server/actions/ProductResults'
import { saveProduct, unsaveProduct, getSavedProductIds } from '@/server/actions/SaveProduct'
import { useSearchParams } from 'next/navigation'

import { Suspense } from 'react'

function ResultsContent() {
  const searchParams = useSearchParams()
  const searchId = searchParams.get('id')

  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [saved, setSaved] = useState<string[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [productsResult, savedIds] = await Promise.all([
          getProductResults(searchId || undefined),
          getSavedProductIds(),
        ])
        if (productsResult.data) {
          setProducts(productsResult.data)
        }
        if (savedIds) {
          setSaved(savedIds.filter((id): id is string => id !== null))
        }
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [searchId])

  const toggleSave = (id: string) => {
    startTransition(async () => {
      if (saved.includes(id)) {
        await unsaveProduct(id)
        setSaved(prev => prev.filter(i => i !== id))
      } else {
        await saveProduct(id)
        setSaved(prev => [...prev, id])
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Winning Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {products.length > 0
              ? `Found ${products.length} high-potential products based on your criteria.`
              : 'No products found yet. Run a search from the Product Finder.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-muted/50 border border-border rounded-lg p-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView('grid')}
                    className={cn("h-8 px-3", view === 'grid' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground")}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Grid View</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView('list')}
                    className={cn("h-8 px-3", view === 'list' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>List View</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="bg-card border-border p-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No products discovered yet</h2>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Head to the Product Finder to run your first AI analysis.</p>
          <Link href="/dashboard/finder">
            <Button className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
              Go to Product Finder
            </Button>
          </Link>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400`}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.trending && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      Trending
                    </span>
                  )}
                  <span className={cn(
                    "text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded",
                    product.competitionLevel === 'Low' ? "bg-emerald-600" :
                    product.competitionLevel === 'Medium' ? "bg-orange-600" : "bg-rose-600"
                  )}>
                    {product.competitionLevel}
                  </span>
                </div>
                <button
                  onClick={() => toggleSave(product.id)}
                  className={cn(
                    "absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-colors z-10",
                    saved.includes(product.id) ? "bg-primary text-primary-foreground" : "bg-black/20 text-white hover:bg-black/40"
                  )}
                >
                  <Bookmark className={cn("w-4 h-4", saved.includes(product.id) && "fill-primary-foreground")} />
                </button>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 line-clamp-1">{product.name}</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Demand Score</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      <span className="text-sm font-bold text-foreground font-mono">{Number(product.demandScore).toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Profit Est.</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 text-emerald-500" />
                      <span className="text-sm font-bold text-foreground font-mono">{Number(product.profitMargin).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Suppliers</p>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3 text-secondary" />
                      <span className="text-sm font-bold text-foreground font-mono">{product.suppliersCount || product.suppliers?.length || 0}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Shipping</p>
                    <div className="flex items-center gap-2">
                      <Truck className="w-3 h-3 text-rose-500" />
                      <span className="text-sm font-bold text-foreground font-mono">{product.shippingDays} days</span>
                    </div>
                  </div>
                </div>

                <Link href={`/dashboard/product/${product.id}`}>
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors group">
                    View Details <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="p-6 font-medium">Product</th>
                    <th className="p-6 font-medium">Demand</th>
                    <th className="p-6 font-medium">Profit</th>
                    <th className="p-6 font-medium">Competition</th>
                    <th className="p-6 font-medium">Shipping</th>
                    <th className="p-6 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={product.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400`}
                              alt={product.name}
                              fill
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{product.name}</p>
                            {product.trending && <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Trending</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-6 font-mono text-primary font-bold">{Number(product.demandScore).toFixed(1)}</td>
                      <td className="p-6 font-mono text-emerald-500 font-bold">{Number(product.profitMargin).toFixed(0)}%</td>
                      <td className="p-6">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          product.competitionLevel === 'Low' ? "bg-emerald-500/10 text-emerald-500" :
                          product.competitionLevel === 'Medium' ? "bg-amber-500/10 text-amber-500" :
                          "bg-rose-500/10 text-rose-500"
                        )}>
                          {product.competitionLevel}
                        </span>
                      </td>
                      <td className="p-6 text-muted-foreground">{product.shippingDays} days</td>
                      <td className="p-6 text-right">
                        <Link href={`/dashboard/product/${product.id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                            Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ProductResults() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
