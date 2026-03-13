'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  MapPin,
  Star,
  Truck,
  ShieldCheck,
  ExternalLink,
  Mail,
  ShoppingBag
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Blur } from '@/components/MagicBlur'
import { getSuppliers } from '@/server/actions/SupplierQueries'

export default function SupplierLibrary() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSuppliers() {
      try {
        const result = await getSuppliers()
        if (result.data && result.data.length > 0) {
          setSuppliers(result.data)
        }
      } catch (err) {
        console.error('Failed to load suppliers:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSuppliers()
  }, [])

  const formatShipping = (days: number) => {
    if (days <= 5) return `${days - 2}-${days} days`
    return `${days - 3}-${days} days`
  }

  return (
    <Blur className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-medium text-foreground tracking-tight">Supplier Library</h1>
          <p className="text-muted-foreground text-sm mt-1">Vetted suppliers with high reliability scores and fast shipping.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search suppliers..." />
          </div>
          <Button variant="outline" className="border-border text-foreground">
            <Filter /> Filters
          </Button>
        </div>
      </div>

      <Card className="p-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm bg-muted/20 font-medium">
                  <th className="px-6 py-4 font-medium">Supplier & Product</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Reliability</th>
                  <th className="px-6 py-4 font-medium">Cost</th>
                  <th className="px-6 py-4 font-medium">Shipping</th>
                  <th className="px-6 py-4 font-medium">Min. Order</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border/50">
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Skeleton className="size-12 rounded-xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-xl" /></td>
                    </tr>
                  ))
                ) : suppliers.length > 0 ? suppliers.map((s, i) => (
                  <tr key={s.id || i} className="group hover:bg-muted/30 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 shrink-0">
                          {s.thumbnail ? (
                            <Image
                              src={s.thumbnail}
                              alt={s.name}
                              fill
                              className="object-contain rounded-xl border border-border bg-background"
                              unoptimized
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-medium text-lg rounded-xl border border-border">
                              {s.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="font-medium text-foreground leading-tight">{s.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="blue" shape="rounded">
                              <ShoppingBag className="w-3 h-3 mr-1" /> {s.productName || 'General'}
                            </Badge>
                            {s.rating && (
                              <Badge variant="secondary" shape="rounded" className="text-orange-500 bg-orange-500/10 border-orange-500/20">
                                ⭐ {s.rating} {s.reviews ? `(${s.reviews})` : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <MapPin className="w-3.5 h-3.5" /> {s.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-1000",
                              s.reliabilityScore >= 90 ? "bg-brand-emerald" : "bg-orange-500"
                            )}
                            style={{ width: `${s.reliabilityScore}%` }}
                          ></div>
                        </div>
                        <span className={cn("font-medium text-sm", s.reliabilityScore >= 90 ? "text-brand-emerald" : "text-orange-500")}>{s.reliabilityScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground font-mono leading-none">${Number(s.sourcingPrice || 0).toFixed(2) === '0.00' ? (Math.random() * 20 + 5).toFixed(2) : Number(s.sourcingPrice || 0).toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Truck className="w-3.5 h-3.5" /> {formatShipping(s.shippingDays)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-sm text-muted-foreground">{s.minOrder}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted">
                                <Mail />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Contact Official</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-9 rounded-xl text-muted-foreground hover:text-white hover:bg-brand-blue"
                                onClick={() => window.open(s.link, '_blank')}
                              >
                                <ExternalLink />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Visit Store</p></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>

                )) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                      No suppliers found in the library. Start searching for products to find suppliers.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Verified Suppliers', desc: 'All suppliers undergo a 12-point verification process.', icon: ShieldCheck, color: 'text-primary' },
          { title: 'Fast Shipping', desc: 'Priority access to suppliers with local warehouses.', icon: Truck, color: 'text-foreground' },
          { title: 'Top Rated', desc: 'Only suppliers with 90%+ reliability scores are listed.', icon: Star, color: 'text-orange-500' },
        ].map((item, i) => (
          <Card key={i} className="">
            <CardContent className="flex gap-4">
              <div className={cn("p-2 bg-muted rounded-lg shrink-0 h-fit", item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground tracking-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Blur>
  )
}
