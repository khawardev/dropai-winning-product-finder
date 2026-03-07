'use client'

import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  Package,
  DollarSign,
  ArrowUpRight,
  Map,
  Search as SearchIcon,
  Bookmark,
  ShoppingCart,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { Progress } from '@/components/ui/progress'
import { MetricCard } from '@/components/DashboardComponents'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { getDashboardStats } from '@/server/actions/DashboardStats'

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)


  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    async function loadStats() {
      try {
        const result = await getDashboardStats()
        if (result.success) {
          setStats(result.data)
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  const productsAnalyzed = stats?.productsAnalyzed || 0
  const activeSuppliers = stats?.activeSuppliers || 0
  const savedProductsCount = stats?.savedProducts || 0
  const potentialRevenue = stats?.potentialRevenue || 0
  const recentProducts = stats?.recentProducts || []
  const trendData = stats?.trendData || []
  const categoryData = stats?.categoryData || []

  const formatRevenue = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
    return `$${value.toFixed(0)}`
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Products Analyzed"
          value={isLoading ? '...' : String(productsAnalyzed)}
          icon={SearchIcon}
          description="Total products analyzed by AI"
        />
        <MetricCard
          label="Active Suppliers"
          value={isLoading ? '...' : String(activeSuppliers)}
          icon={Package}
          description="Vetted suppliers currently in the library"
        />
        <MetricCard
          label="Potential Revenue"
          value={isLoading ? '...' : formatRevenue(potentialRevenue)}
          icon={ShoppingCart}
          description="Estimated potential revenue from products"
        />
        <MetricCard
          label="Saved Products"
          value={isLoading ? '...' : String(savedProductsCount)}
          icon={Bookmark}
          description="Number of products you've bookmarked"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Global Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {isMounted && trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{fill: 'var(--muted-foreground)', fontSize: 12}}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{fill: 'var(--muted-foreground)', fontSize: 12}}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '18px', padding: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(12px)'}}
                      itemStyle={{color: 'var(--primary)'}}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No trend data available. Start searching to see trends.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Map className="w-5 h-5 text-secondary" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              {categoryData.length > 0 ? categoryData.map((cat: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className="text-foreground font-medium">{cat.value}%</span>
                  </div>
                  <Progress value={cat.value} className="h-2" />
                </div>
              )) : (
                <div className="text-muted-foreground text-sm py-4">
                  No category data available yet.
                </div>
              )}
            </div>
            <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <p className="text-xs text-primary font-medium uppercase tracking-wider">AI Insight</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {productsAnalyzed > 0
                  ? `${productsAnalyzed} products analyzed so far. Run more searches to uncover trending niches.`
                  : 'No products analyzed yet. Run a search to uncover trending niches.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Winning Products</CardTitle>
          <Link href="/dashboard/results">
            <Button variant="outline" size="sm" className="text-xs">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="pb-4 font-medium">Product</th>
                    <th className="pb-4 font-medium">Demand Score</th>
                    <th className="pb-4 font-medium">Profit Est.</th>
                    <th className="pb-4 font-medium">Competition</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border">
                  {recentProducts.map((row: any, i: number) => (
                    <tr key={i} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-4 font-medium text-foreground">{row.name}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${row.demandScore}%` }}></div>
                          </div>
                          <span className="text-emerald-500 font-mono font-medium">{row.demandScore.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-4 text-muted-foreground font-mono">{row.profitMargin.toFixed(0)}%</td>
                      <td className="py-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          row.competitionLevel === 'Low' ? "bg-emerald-500/10 text-emerald-500" :
                          row.competitionLevel === 'Medium' ? "bg-amber-500/10 text-amber-500" :
                          "bg-rose-500/10 text-rose-500"
                        )}>
                          {row.competitionLevel}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-primary font-medium">{row.trending ? 'Trending' : 'Stable'}</span>
                      </td>
                      <td className="py-4 text-right">
                        <Link href={`/dashboard/product/${row.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products analyzed yet. Start with the Product Finder.</p>
              <Link href="/dashboard/finder">
                <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  Go to Product Finder
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
