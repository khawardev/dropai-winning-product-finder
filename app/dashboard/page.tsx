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
  ChevronRight,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts'
import useSWR from 'swr'
import { Progress } from '@/components/ui/Progress'
import { MetricCard } from '@/components/DashboardComponents'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Blur } from '@/components/MagicBlur'
import { getDashboardStats } from '@/server/actions/DashboardStats'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
        <p className="text-sm font-medium text-primary">{payload[0].value.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export default function DashboardOverview() {
  const isMounted = React.useRef(false);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    isMounted.current = true;
    setForceUpdate(prev => prev + 1);
  }, []);

  const { data: result, error, isLoading } = useSWR('dashboard-stats', getDashboardStats, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });

  const stats = result?.success ? result.data : null;

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
    <Blur className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor your product performance and market trends.</p>
        </div>
        <Link href="/dashboard/dropai">
          <Button size="xl" shape="xl" glow className="gap-2">
            <SearchIcon className="size-4" /> Find New Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Products Analyzed"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : String(productsAnalyzed)}
          icon={SearchIcon}
          description="Total AI analysis runs"
        />
        <MetricCard
          label="Active Suppliers"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : String(activeSuppliers)}
          icon={Package}
          description="Verified global partners"
        />
        <MetricCard
          label="Potential Revenue"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : formatRevenue(potentialRevenue)}
          icon={ShoppingCart}
          description="Estimated market value"
        />
        <MetricCard
          label="Saved Products"
          value={isLoading ? <Skeleton className="h-8 w-16" /> : String(savedProductsCount)}
          icon={Bookmark}
          description="Items in your watchlist"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="size-5 text-brand-blue" />
              Global Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pt-4 pb-2">
            <div className="h-[300px] w-full relative">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : isMounted.current && trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
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
                      tickFormatter={(value) => `${value}%`}
                      dx={-10}
                    />
                    <Tooltip
                      content={({ active, payload, label }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border p-3 rounded-xl shadow-2xl backdrop-blur-md z-50">
                              <p className="text-sm text-muted-foreground font-medium mb-1  ">{label}</p>
                              <p className="text-sm font-medium text-primary">
                                {payload[0].name}: {payload[0].value.toFixed(1)}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ stroke: '#027bdd', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                      wrapperStyle={{ zIndex: 1000, outline: 'none' }}
                      allowEscapeViewBox={{ x: true, y: true }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      height={40}
                      wrapperStyle={{
                        paddingBottom: '20px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}
                    />
                    <Area
                      name="Margin %"
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

        <Card className="overflow-hidden">
          <CardHeader className="border-b ">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Map className="size-5 text-brand-cyan" />
              Category Insights
            </CardTitle>
          </CardHeader>
          <CardContent >
            <div className="space-y-5">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-1.5 w-full" />
                  </div>
                ))
              ) : categoryData.length > 0 ? categoryData.map((cat: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground font-medium">{cat.name}</span>
                    <span className="text-foreground font-medium">{cat.value}%</span>
                  </div>
                  <Progress value={cat.value} className="h-1.5" />
                </div>
              )) : (
                <div className="text-muted-foreground text-sm py-4">
                  No category data available yet.
                </div>
              )}
            </div>
            <div className="mt-8 p-5 bg-linear-to-br from-brand-blue/5 to-brand-cyan/5 border border-brand-blue/10 rounded-2xl relative overflow-hidden group">
              <p className="text-sm text-brand-blue font-medium  mb-2">AI Pulse</p>
              <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                {productsAnalyzed > 0
                  ? `High volume detection in ${categoryData[0]?.name || 'current categories'}. Consider scaling your ${categoryData[0]?.name || 'top'} niche.`
                  : 'Start searching to uncover high-demand product categories for your store.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b ">
          <CardTitle className="text-lg font-medium">Winning Products</CardTitle>
          <Link href="/dashboard/saved">
            <Button variant="ghost" size="sm" className="font-medium gap-1">
              View All <ChevronRight className="size-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              ))}
            </div>
          ) : recentProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-muted-foreground text-sm  bg-muted/10 ">
                    <th className="px-6 py-4 font-medium">Product Name</th>
                    <th className="px-6 py-4 font-medium">Demand</th>
                    <th className="px-6 py-4 text-center font-medium">Profit</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 text-right font-medium">Insight</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border/50">
                  {recentProducts.map((row: any, i: number) => (
                    <tr key={i} className="group hover:bg-muted/30 transition-all cursor-pointer">
                      <td className="px-6 py-4 font-medium text-foreground">{row.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-brand-blue to-brand-cyan"
                              style={{ width: `${row.demandScore}%` }}
                            ></div>
                          </div>
                          <span className="text-brand-blue font-medium text-sm">{row.demandScore.toFixed(0)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-medium text-brand-emerald">
                        {row.profitMargin?.toFixed(0) || 0}%
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={row.trending ? "blue" : "secondary"}
                          shape="pill"
                          className="text-sm font-medium"
                        >
                          {row.trending ? 'Trending' : 'Stable'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/product/${row.id}`}>
                          <Button variant="ghost" size="icon-sm" className="hover:bg-brand-blue hover:text-white transition-all">
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
                <p className="text-foreground font-medium text-lg">No winners yet</p>
                <p className="text-muted-foreground text-sm mt-1">Start your first search to find winning products.</p>
              </div>
              <Link href="/dashboard/dropai">
                <Button shape="xl" className="mt-2">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </Blur>
  )
}
