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
  Loader2,
  ChevronRight,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { Progress } from '@/components/ui/Progress'
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor your product performance and market trends.</p>
        </div>
        <Link href="/dashboard/dropai">
          <Button size={'lg'} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 gap-2">
            <SearchIcon className="size-4" /> Find New Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Products Analyzed"
          value={isLoading ? '...' : String(productsAnalyzed)}
          icon={SearchIcon}
          description="Total AI analysis runs"
        />
        <MetricCard
          label="Active Suppliers"
          value={isLoading ? '...' : String(activeSuppliers)}
          icon={Package}
          description="Verified global partners"
        />
        <MetricCard
          label="Potential Revenue"
          value={isLoading ? '...' : formatRevenue(potentialRevenue)}
          icon={ShoppingCart}
          description="Estimated market value"
        />
        <MetricCard
          label="Saved Products"
          value={isLoading ? '...' : String(savedProductsCount)}
          icon={Bookmark}
          description="Items in your watchlist"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="size-5 text-brand-blue" />
              Global Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="h-[300px] w-full">
              {isMounted && trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#027bdd" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#027bdd" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', padding: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(12px)' }}
                      itemStyle={{ color: '#027bdd', fontWeight: 'bold' }}
                      cursor={{ stroke: '#027bdd', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#027bdd"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                    <TrendingUp className="size-5" />
                  </div>
                  No trend data available yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Map className="size-5 text-brand-cyan" />
              Category Insights
            </CardTitle>
          </CardHeader>
          <CardContent >
            <div className="space-y-5">
              {categoryData.length > 0 ? categoryData.map((cat: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground font-medium">{cat.name}</span>
                    <span className="text-foreground font-bold">{cat.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-linear-to-r from-brand-blue to-brand-cyan"
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              )) : (
                <div className="text-muted-foreground text-sm py-4">
                  No category data available yet.
                </div>
              )}
            </div>
            <div className="mt-8 p-5 bg-linear-to-br from-brand-blue/5 to-brand-cyan/5 border border-brand-blue/10 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="size-12 text-brand-blue" />
              </div>
              <p className="text-xs text-brand-blue font-bold uppercase tracking-widest mb-2">AI Pulse</p>
              <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                {productsAnalyzed > 0
                  ? `High volume detection in ${categoryData[0]?.name || 'current categories'}. Consider scaling your ${categoryData[0]?.name || 'top'} niche.`
                  : 'Start searching to uncover high-demand product categories for your store.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20">
          <CardTitle className="text-lg font-bold">Winning Products</CardTitle>
          <Link href="/dashboard/results">
            <Button variant="ghost" size="sm" className="text-xs font-bold hover:bg-muted/50 rounded-lg gap-1">
              View All <ChevronRight className="size-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-muted-foreground text-[11px] uppercase tracking-widest bg-muted/10 font-bold">
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Demand</th>
                    <th className="px-6 py-4 text-center">Profit</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Insight</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border/50">
                  {recentProducts.map((row: any, i: number) => (
                    <tr key={i} className="group hover:bg-muted/30 transition-all cursor-pointer">
                      <td className="px-6 py-4 font-bold text-foreground">{row.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-brand-blue to-brand-cyan"
                              style={{ width: `${row.demandScore}%` }}
                            ></div>
                          </div>
                          <span className="text-brand-blue font-bold text-xs">{row.demandScore.toFixed(0)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-brand-emerald">
                        {row.profitMargin?.toFixed(0) || 0}%
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          row.trending
                            ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20"
                            : "bg-muted text-muted-foreground border border-border"
                        )}>
                          {row.trending ? 'Trending' : 'Stable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/product/${row.id}`}>
                          <Button variant="ghost" size="sm" className="size-8 p-0 rounded-lg hover:bg-brand-blue hover:text-white transition-all">
                            <ArrowUpRight className="size-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <div className="size-16 rounded-2xl bg-muted flex items-center justify-center border border-border">
                <Package className="size-8 text-muted-foreground" />
              </div>
              <div className="max-w-xs">
                <p className="text-foreground font-bold text-lg">No winners yet</p>
                <p className="text-muted-foreground text-sm mt-1">Start your first search to find winning products.</p>
              </div>
              <Link href="/dashboard/dropai">
                <Button className="mt-2 bg-primary hover:bg-primary/90 rounded-xl px-8">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
