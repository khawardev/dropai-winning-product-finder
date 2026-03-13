'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Bookmark,
  TrendingUp,
  DollarSign,
  Trash2,
  ExternalLink,
  Search,
  ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import {Skeleton}  from '@/components/ui/Skeleton'
import { getSavedProducts, deleteWinningProduct } from '@/server/actions/SaveProduct'
import { Blur } from '@/components/MagicBlur'

export default function SavedProductsPage() {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function loadSaved() {
      try {
        const result = await getSavedProducts()
        if (result.data) {
          setItems(result.data)
        }
      } catch (err) {
        console.error('Failed to load saved products:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSaved()
  }, [])

  const removeItem = (id: string) => {
    if (!confirm('Are you sure you want to remove this winning product?')) return;
    startTransition(async () => {
      await deleteWinningProduct(id)
      setItems(prev => prev.filter(item => item.id !== id))
    })
  }

  const filteredItems = items.filter(item =>
    item.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.region.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <Blur className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="pt-0 overflow-hidden">
              <Skeleton className="aspect-video" />
              <CardContent className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 rounded-2xl" />
                  <Skeleton className="h-16 rounded-2xl" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Blur>
    )
  }

  return (
    <Blur className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-medium text-foreground tracking-tight">Winning Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Your collection of high-potential products with complete intelligence snapshots.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            className="pl-10 bg-muted/50 border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((product) => {
            const pipeline = product.pipelineData || {};
            const profitability = pipeline.profitability;
            const suppliers = pipeline.suppliers?.suppliers || [];
            const competitors = pipeline.competitive?.competitors || [];
            const trendResults = pipeline.trends?.rising_queries || [];

            // Tiered thumbnail selection
            const thumbnail = pipeline.imageUrl || 
              competitors.find((c: any) => c.thumbnail || c.favicon)?.thumbnail || 
              competitors.find((c: any) => c.thumbnail || c.favicon)?.favicon || 
              suppliers.find((s: any) => s.thumbnail || s.favicon)?.thumbnail || 
              suppliers.find((s: any) => s.thumbnail || s.favicon)?.favicon || 
              '';

            return (
              <Card key={product.id} className="pt-0 group overflow-hidden hover:border-primary/30 transition-all duration-500 shadow-2xl shadow-primary/5">
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={product.keyword}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-linear-to-br from-muted to-secondary/20">
                      <ShoppingBag className="w-12 h-12 text-muted-foreground/10" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => removeItem(product.id)}
                            variant="destructive"
                            size="icon"
                            className="rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Delete Research</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="absolute top-4 left-4">
                    <Badge
                      variant={profitability?.verdict?.toLowerCase().includes('strong') || profitability?.verdict?.toLowerCase().includes('good') ? "emerald" : "blue"}
                      shape="pill"
                      className="px-4 py-1.5"
                    >
                      {profitability?.verdict || 'In Analysis'}
                    </Badge>
                  </div>
                </div>
                <CardContent >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-foreground capitalize leading-tight">{product.keyword}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" shape="rounded">Region: {product.region}</Badge>
                        <span className="text-sm font-medium text-muted-foreground font-mono">{new Date(product.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                      <p className="text-sm text-muted-foreground font-medium mb-1">Target Margin</p>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-brand-emerald" />
                        <span className="text-base font-medium text-foreground tracking-tighter">{profitability?.marginPercent?.toFixed(0) || 0}%</span>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                      <p className="text-sm text-muted-foreground font-medium mb-1">Research Depth</p>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-brand-blue" />
                        <span className="text-base font-medium text-foreground tracking-tighter">{suppliers.length + competitors.length}+</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/product/${product.id}`} className="flex-1">
                      <Button className="w-full" glow shape="xl">
                        Open Pipeline 
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium text-foreground">No winning products yet</h2>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Complete the Trend → Competition → Supplier workflow to save your first snapshot.</p>
          <Link href="/dashboard/dropai">
            <Button className="mt-8">
              Start Research
            </Button>
          </Link>
        </Card>
      )}
    </Blur>
  )
}
