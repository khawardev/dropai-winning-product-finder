'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  TrendingUp,
  DollarSign,
  Activity,
  Truck,
  Bookmark,
  ChevronLeft,
  Star,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  MessageSquare,
  FileText,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const trendData = [
  { name: 'Jan', value: 200 },
  { name: 'Feb', value: 350 },
  { name: 'Mar', value: 480 },
  { name: 'Apr', value: 700 },
  { name: 'May', value: 850 },
  { name: 'Jun', value: 1200 },
];

const profitData = [
  { name: 'COGS', value: 8.50, color: 'var(--primary)' },
  { name: 'Shipping', value: 4.20, color: 'var(--secondary)' },
  { name: 'Ad Spend', value: 6.00, color: '#F59E0B' },
  { name: 'Profit', value: 11.30, color: '#22C55E' },
];

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const [isSaved, setIsSaved] = useState(false);
  const resolvedParams = React.use(params);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/results">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Portable Dog Water Bottle</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground">ID: PRD-82910</span>
            <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded">Trending Now</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("border-border", isSaved ? "bg-primary text-primary-foreground border-primary" : "text-foreground")}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Bookmark className={cn("w-4 h-4", isSaved && "fill-primary-foreground")} /> {isSaved ? 'Saved' : 'Save Product'}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{isSaved ? 'Remove from saved' : 'Save for later'}</p></TooltipContent>
            </UITooltip>
          </TooltipProvider>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Export to Shopify
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src="https://picsum.photos/seed/dog/800/800"
                alt="Product"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Demand Score', value: '8.9/10', icon: TrendingUp, color: 'text-primary' },
              { label: 'Profit Margin', value: '42%', icon: DollarSign, color: 'text-emerald-500' },
              { label: 'Comp. Index', value: 'Medium', icon: Activity, color: 'text-orange-500' },
              { label: 'Shipping', value: '7 Days', icon: Truck, color: 'text-rose-500' },
            ].map((stat, i) => (
              <Card key={i} className="bg-card border-border p-4">
                <stat.icon className={cn("w-4 h-4 mb-2", stat.color)} />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</p>
                <p className="text-lg font-bold text-foreground mt-1">{stat.value}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-muted/50 border border-border p-1 w-full justify-start h-12">
              <TabsTrigger value="overview" className="px-8 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
              <TabsTrigger value="suppliers" className="px-8 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Suppliers</TabsTrigger>
              <TabsTrigger value="ads" className="px-8 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Ads & Creative</TabsTrigger>
              <TabsTrigger value="notes" className="px-8 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">AI Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-8 ">
              {/* Trend Chart */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Demand Trend (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '18px', padding: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(12px)' }}
                          itemStyle={{ color: 'var(--primary)' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fill="url(#colorTrend)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Profit Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Profit Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={profitData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                          <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '18px', padding: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(12px)' }}
                            itemStyle={{ color: 'var(--primary)' }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {profitData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Retail Price</span>
                        <span className="text-foreground font-bold">$29.99</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Costs</span>
                        <span className="text-rose-500 font-bold">-$18.70</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between text-base">
                        <span className="text-foreground font-bold">Net Profit</span>
                        <span className="text-emerald-500 font-bold">$11.29</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Market Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 font-bold">
                        4.8
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">High Customer Satisfaction</p>
                        <p className="text-xs text-muted-foreground">Based on 1,200+ global reviews</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Quality', score: 95 },
                        { label: 'Shipping Speed', score: 82 },
                        { label: 'Value for Money', score: 88 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="text-foreground font-medium">{item.score}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${item.score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suppliers" className="mt-6 ">
              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                          <th className="p-6 font-medium">Supplier</th>
                          <th className="p-6 font-medium">Location</th>
                          <th className="p-6 font-medium">Price</th>
                          <th className="p-6 font-medium">Shipping</th>
                          <th className="p-6 font-medium">Rating</th>
                          <th className="p-6 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-border">
                        {[
                          { name: 'PetWorld Global', loc: 'China', price: '$8.50', ship: '7-12 days', rating: 4.9 },
                          { name: 'US Pet Supplies', loc: 'USA', price: '$12.20', ship: '3-5 days', rating: 4.7 },
                          { name: 'QuickShip Dropship', loc: 'China', price: '$9.10', ship: '5-10 days', rating: 4.8 },
                        ].map((s, i) => (
                          <tr key={i} className="group hover:bg-muted/30 transition-colors">
                            <td className="p-6 font-bold text-foreground">{s.name}</td>
                            <td className="p-6 text-muted-foreground">{s.loc}</td>
                            <td className="p-6 text-emerald-500 font-mono font-bold">{s.price}</td>
                            <td className="p-6 text-muted-foreground">{s.ship}</td>
                            <td className="p-6">
                              <div className="flex items-center gap-1 text-orange-500">
                                <Star className="w-3 h-3 fill-orange-500" /> {s.rating}
                              </div>
                            </td>
                            <td className="p-6 text-right">
                              <Button variant="ghost" size="sm" className="text-primary hover:text-primary-foreground hover:bg-primary">
                                Contact <ExternalLink className="ml-2 w-3 h-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ads" className="mt-6 space-y-6 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-primary" /> Video Ad Hook
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/50 border border-border rounded-xl italic text-sm text-muted-foreground">
                      &quot;Is your dog always thirsty on walks? Stop carrying bulky bowls! This 2-in-1 bottle is a game changer...&quot;
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-500 font-bold uppercase">
                      <CheckCircle2 className="w-4 h-4" /> High Conversion Potential
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-500" /> Targeting Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {['Dog Lovers', 'Outdoor Enthusiasts', 'Pet Care', 'Hiking & Camping'].map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6 ">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" /> AI Agent Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-foreground">Launch Strategy</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          This product is currently viral on TikTok. We recommend starting with TikTok Spark Ads using UGC (User Generated Content) of dogs drinking from the bottle in various outdoor settings.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-foreground">Risk Assessment</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Low risk. The product has high utility and low return rates. Ensure you use BPA-free materials in your marketing copy to build trust.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      <span className="text-orange-500 font-bold uppercase">Pro Tip:</span> Bundle this with a portable dog bowl or a leash attachment for a 20% higher average order value.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
