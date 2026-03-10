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
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Supplier Library</h1>
          <p className="text-muted-foreground text-sm mt-1">Vetted suppliers with high reliability scores and fast shipping.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search suppliers..." className="pl-10 bg-muted/50 border-border" />
          </div>
          <Button variant="outline" className="border-border text-foreground">
            <Filter className="mr-2 w-4 h-4" /> Filters
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-6 font-medium">Supplier Name</th>
                  <th className="p-6 font-medium">Location</th>
                  <th className="p-6 font-medium">Shipping Time</th>
                  <th className="p-6 font-medium">Reliability</th>
                  <th className="p-6 font-medium">Min. Order</th>
                  <th className="p-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border">
                {suppliers.length > 0 ? suppliers.map((s, i) => (
                  <tr key={s.id || i} className="group hover:bg-muted/30 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{s.name}</p>
                          <div className="flex gap-1 mt-1">
                            {(s.categories || []).map((cat: string, j: number) => (
                              <span key={j} className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-3 h-3" /> {s.location}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="w-3 h-3" /> {formatShipping(s.shippingDays)}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${s.reliabilityScore}%` }}></div>
                        </div>
                        <span className="text-emerald-500 font-mono font-bold">{s.reliabilityScore}%</span>
                      </div>
                    </td>
                    <td className="p-6 text-muted-foreground">{s.minOrder}</td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                                <Mail className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Contact Supplier</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary-foreground hover:bg-primary">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>View Website</p></TooltipContent>
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
          { title: 'Fast Shipping', desc: 'Priority access to suppliers with local warehouses.', icon: Truck, color: 'text-secondary' },
          { title: 'Top Rated', desc: 'Only suppliers with 90%+ reliability scores are listed.', icon: Star, color: 'text-orange-500' },
        ].map((item, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="pt-6 flex gap-4">
              <div className={cn("p-2 bg-muted rounded-lg shrink-0 h-fit", item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
