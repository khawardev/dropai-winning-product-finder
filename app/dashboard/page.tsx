'use client';

import React from 'react';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Map,
  Search as SearchIcon,
  Bookmark,
  ShoppingCart,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import { MetricCard } from '@/components/DashboardComponents';
import { cn } from '@/lib/utils';

const trendData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 1100 },
];

const categoryData = [
  { name: 'Home & Garden', value: 85 },
  { name: 'Gadgets', value: 62 },
  { name: 'Pet Supplies', value: 48 },
  { name: 'Fitness', value: 35 },
];

const recentProducts = [
  { name: 'Portable Dog Water Bottle', score: '8.9', profit: '42%', comp: 'Medium', status: 'Trending' },
  { name: 'Self-Cleaning Hair Brush', score: '9.2', profit: '55%', comp: 'Low', status: 'Hot' },
  { name: 'Galaxy Projector Pro', score: '7.5', profit: '30%', comp: 'High', status: 'Stable' },
  { name: 'Ergonomic Seat Cushion', score: '8.1', profit: '48%', comp: 'Medium', status: 'Rising' },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Alex. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Products Analyzed" 
          value="1,284" 
          icon={SearchIcon} 
          trend="+12.5%" 
          up={true}
          description="Total products analyzed by AI in the last 24 hours"
        />
        <MetricCard 
          label="Top Trending Niche" 
          value="Pet Tech" 
          icon={Zap} 
          trend="Hot"
          description="The niche with the highest growth potential right now"
        />
        <MetricCard 
          label="Avg. Profit Margin" 
          value="38.4%" 
          icon={DollarSign} 
          trend="+2.4%" 
          up={true}
          description="Average estimated profit margin across analyzed products"
        />
        <MetricCard 
          label="Competition Score" 
          value="Low" 
          icon={Activity} 
          trend="-5%" 
          up={true}
          description="Overall market competition level for top trending products"
        />
        <MetricCard 
          label="Active Suppliers" 
          value="452" 
          icon={Package} 
          trend="+12" 
          up={true}
          description="Vetted suppliers currently in the library"
        />
        <MetricCard 
          label="Potential Revenue" 
          value="$12.4k" 
          icon={ShoppingCart} 
          trend="+18%" 
          up={true}
          description="Estimated potential revenue from saved products"
        />
        <MetricCard 
          label="Market Reach" 
          value="Global" 
          icon={Globe} 
          description="Your current target market reach"
        />
        <MetricCard 
          label="Saved Products" 
          value="24" 
          icon={Bookmark} 
          description="Number of products you've bookmarked for later"
        />
      </div>

      {/* Charts Section */}
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
              <ResponsiveContainer width="100%" height="100%">
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
              {categoryData.map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className="text-foreground font-medium">{cat.value}%</span>
                  </div>
                  <Progress value={cat.value} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <p className="text-xs text-primary font-medium uppercase tracking-wider">AI Insight</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                &quot;Pet Tech&quot; is seeing a 24% surge in demand in the UK market. Consider exploring smart feeders.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Winning Products */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Winning Products</CardTitle>
          <Button variant="outline" size="sm" className="text-xs">View All</Button>
        </CardHeader>
        <CardContent>
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
                {recentProducts.map((row, i) => (
                  <tr key={i} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-4 font-medium text-foreground">{row.name}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${parseFloat(row.score) * 10}%` }}></div>
                        </div>
                        <span className="text-emerald-500 font-mono font-medium">{row.score}</span>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground font-mono">{row.profit}</td>
                    <td className="py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold uppercase",
                        row.comp === 'Low' ? "bg-emerald-500/10 text-emerald-500" : 
                        row.comp === 'Medium' ? "bg-amber-500/10 text-amber-500" : 
                        "bg-rose-500/10 text-rose-500"
                      )}>
                        {row.comp}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-primary font-medium">{row.status}</span>
                    </td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
