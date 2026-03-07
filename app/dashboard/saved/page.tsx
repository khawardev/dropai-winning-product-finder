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
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getSavedProducts, unsaveProduct } from '@/server/actions/SaveProduct'

export default function SavedProductsPage() {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  const removeItem = (productId: string) => {
    startTransition(async () => {
      await unsaveProduct(productId)
      setItems(prev => prev.filter(item => item.id !== productId))
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
          <h1 className="text-2xl font-bold text-foreground">Saved Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Your collection of high-potential products for future launches.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search saved items..." className="pl-10 bg-muted/50 border-border" />
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => (
            <Card key={product.id} className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={product.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400`}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60"></div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors backdrop-blur-md z-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent><p>Remove from saved</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-foreground line-clamp-1">{product.name}</h3>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {product.savedAt ? new Date(product.savedAt).toLocaleDateString() : ''}
                  </span>
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    <span className="text-xs font-bold text-foreground font-mono">{Number(product.demandScore).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs font-bold text-foreground font-mono">{Number(product.profitMargin).toFixed(0)}%</span>
                  </div>
                </div>

                {product.savedNotes && (
                  <div className="p-3 bg-muted/50 border border-border rounded-lg mb-6">
                    <p className="text-xs text-muted-foreground italic">&quot;{product.savedNotes}&quot;</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href={`/dashboard/product/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                      Details
                    </Button>
                  </Link>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border p-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No saved products yet</h2>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Start exploring the Product Finder to build your winning collection.</p>
          <Link href="/dashboard/finder">
            <Button className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
              Go to Product Finder
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
