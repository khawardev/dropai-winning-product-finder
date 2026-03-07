'use client';

import React, { useState, useEffect } from 'react';
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
  Zap,
  Loader2
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
import { getProductById } from '@/server/actions/ProductResults';
import { saveProduct, unsaveProduct, getSavedProductIds } from '@/server/actions/SaveProduct';

const trendData = [
  { name: 'Jan', value: 200 },
  { name: 'Feb', value: 350 },
  { name: 'Mar', value: 480 },
  { name: 'Apr', value: 700 },
  { name: 'May', value: 850 },
  { name: 'Jun', value: 1200 },
];

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function loadProduct() {
      try {
        const [result, savedIds] = await Promise.all([
          getProductById(productId),
          getSavedProductIds()
        ]);
        
        if (result.success) {
          setProduct(result.data);
          setIsSaved(savedIds.includes(productId));
        } else {
          setError(result.error || 'Failed to load product');
        }
      } catch (err) {
        console.error('Failed to fetch product detail:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await unsaveProduct(productId);
        setIsSaved(false);
      } else {
        await saveProduct(productId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Toggle save failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading intelligence report...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold text-foreground">Product not found</h2>
        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">The product you are looking for might have been removed or the search has expired.</p>
        <Link href="/dashboard/results" className="mt-8">
          <Button variant="outline">Back to Winning Products</Button>
        </Link>
      </div>
    );
  }

  const aiAnalysis = product.aiAnalysis || {};
  const profitAnalysis = aiAnalysis.profitAnalysis || {};
  
  const formattedProfitData = [
    { name: 'COGS', value: Number(product.costPrice) || 0, color: 'var(--primary)' },
    { name: 'Shipping', value: Number(profitAnalysis.shippingCost) || 0, color: 'var(--secondary)' },
    { name: 'Ad Spend', value: Number(profitAnalysis.estimatedAdSpend) || 5.00, color: '#F59E0B' },
    { name: 'Profit', value: Number(profitAnalysis.netProfit) || (Number(product.sellingPrice) - Number(product.costPrice) - (Number(profitAnalysis.shippingCost) || 0) - (Number(profitAnalysis.estimatedAdSpend) || 5.00)), color: '#22C55E' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/results">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground">ID: PRD-{product.id.substring(0, 8).toUpperCase()}</span>
            {product.trending && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                Trending Now
              </span>
            )}
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("border-border", isSaved ? "bg-primary text-primary-foreground border-primary" : "text-foreground")}
                  onClick={toggleSave}
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
                src={product.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(product.name)}/800/800`}
                alt={product.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Demand Score', value: `${Number(product.demandScore).toFixed(1)}/10`, icon: TrendingUp, color: 'text-primary' },
              { label: 'Profit Margin', value: `${Number(product.profitMargin).toFixed(0)}%`, icon: DollarSign, color: 'text-emerald-500' },
              { label: 'Comp. Index', value: product.competitionLevel || 'Medium', icon: Activity, color: product.competitionLevel === 'Low' ? 'text-emerald-500' : product.competitionLevel === 'Medium' ? 'text-orange-500' : 'text-rose-500' },
              { label: 'Shipping', value: `${product.shippingDays} Days`, icon: Truck, color: 'text-rose-500' },
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
            <TabsList className="bg-muted/50 border border-border p-1 w-full justify-start h-12 overflow-x-auto overflow-y-hidden no-scrollbar">
              <TabsTrigger value="overview" className="px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">Overview</TabsTrigger>
              <TabsTrigger value="suppliers" className="px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">Suppliers</TabsTrigger>
              <TabsTrigger value="competitors" className="px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">Competitors</TabsTrigger>
              <TabsTrigger value="ads" className="px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap">Ads & Strategy</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-8 ">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Product Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description || `AI-identified winning product in the ${product.name} category. This product shows strong market demand and favorable profit margins for dropshippers.`}
                  </p>
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
                      {isMounted && (
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                          <BarChart data={formattedProfitData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '18px', padding: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(12px)' }}
                              itemStyle={{ color: 'var(--primary)' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {formattedProfitData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Retail Price</span>
                        <span className="text-foreground font-bold">${Number(product.sellingPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Costs</span>
                        <span className="text-rose-500 font-bold">-${(Number(product.sellingPrice) - (formattedProfitData.find(d => d.name === 'Profit')?.value || 0)).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between text-base">
                        <span className="text-foreground font-bold">Net Profit</span>
                        <span className="text-emerald-500 font-bold">${(formattedProfitData.find(d => d.name === 'Profit')?.value || 0).toFixed(2)}</span>
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
                        {aiAnalysis.sentimentScore || '4.8'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Social Proof Summary</p>
                        <p className="text-xs text-muted-foreground">{aiAnalysis.socialProof || 'Strong engagement on social media platforms TikTok and Instagram.'}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Demand', score: Number(product.demandScore) * 10 },
                        { label: 'Market Gap Score', score: Number(profitAnalysis.marketGapScore) || 75 },
                        { label: 'Competition Ease', score: product.competitionLevel === 'Low' ? 90 : product.competitionLevel === 'Medium' ? 60 : 30 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="text-foreground font-medium">{item.score.toFixed(0)}%</span>
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
                        {product.suppliers && product.suppliers.length > 0 ? (
                          product.suppliers.map((s: any, i: number) => (
                            <tr key={i} className="group hover:bg-muted/30 transition-colors">
                              <td className="p-6 font-bold text-foreground">{s.supplierName}</td>
                              <td className="p-6 text-muted-foreground">{s.location}</td>
                              <td className="p-6 text-emerald-500 font-mono font-bold">${Number(s.costPrice).toFixed(2)}</td>
                              <td className="p-6 text-muted-foreground">{s.shippingDays} days</td>
                              <td className="p-6">
                                <div className="flex items-center gap-1 text-orange-500">
                                  <Star className="w-3 h-3 fill-orange-500" /> {s.reliabilityScore ? (Number(s.reliabilityScore) / 20).toFixed(1) : '4.5'}
                                </div>
                              </td>
                              <td className="p-6 text-right">
                                {s.productUrl ? (
                                  <a href={s.productUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-foreground hover:bg-primary">
                                      Contact <ExternalLink className="ml-2 w-3 h-3" />
                                    </Button>
                                  </a>
                                ) : (
                                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-foreground hover:bg-primary">
                                    Contact <ExternalLink className="ml-2 w-3 h-3" />
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-muted-foreground">No suppliers found for this product.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competitors" className="mt-6 ">
              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                          <th className="p-6 font-medium">Competitor</th>
                          <th className="p-6 font-medium">Platform</th>
                          <th className="p-6 font-medium">Price</th>
                          <th className="p-6 font-medium">Shipping</th>
                          <th className="p-6 font-medium">Rating/Reviews</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-border">
                        {product.competitors && product.competitors.length > 0 ? (
                          product.competitors.map((c: any, i: number) => (
                            <tr key={i} className="group hover:bg-muted/30 transition-colors">
                              <td className="p-6 font-bold text-foreground">{c.sellerName}</td>
                              <td className="p-6 text-muted-foreground">{c.platform}</td>
                              <td className="p-6 text-emerald-500 font-mono font-bold">${Number(c.retailPrice).toFixed(2)}</td>
                              <td className="p-6 text-muted-foreground">${Number(c.shippingPrice || 0).toFixed(2)}</td>
                              <td className="p-6">
                                <div className="flex items-center gap-1 text-orange-500">
                                  <Star className="w-3 h-3 fill-orange-500" /> {c.rating ? Number(c.rating).toFixed(1) : 'N/A'} ({c.reviewCount || 0})
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-muted-foreground">No competitor data found for this product.</td>
                          </tr>
                        )}
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
                      <PlayCircle className="w-5 h-5 text-primary" /> AI Agent Strategy
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
                            {profitAnalysis.launchAdvice || "Start with social media ads targeting enthusiasts in your niche. Use high-quality visual content and emphasize product utility."}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-secondary-foreground" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground">Risk Assessment</p>
                          {Array.isArray(profitAnalysis.riskAssessment) ? (
                            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                              {profitAnalysis.riskAssessment.map((risk: string, i: number) => <li key={i}>{risk}</li>)}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {profitAnalysis.riskAssessment || "Low to moderate risk. Product has proven utility but competition should be monitored weekly."}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl flex gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        <span className="text-orange-500 font-bold uppercase">Verdict:</span> {profitAnalysis.verdict || "GO - Proceed with testing"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-500" /> Targeting Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {['Viral Content', 'Social Media', 'Impulse Purchase', 'Targeted Niche'].map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="p-4 bg-muted/50 border border-border rounded-xl mt-4">
                      <p className="text-sm font-bold text-foreground mb-2">AI Pro Tip</p>
                      <p className="text-xs text-muted-foreground">
                        {aiAnalysis.aiNotes || "Test with a small ad budget first to validate the creative performance before scaling. Analyze competitors shipping times to find your edge."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
