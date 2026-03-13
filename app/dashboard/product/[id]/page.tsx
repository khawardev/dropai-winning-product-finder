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
  MapPin,
  Clock,
  ShoppingBag
} from 'lucide-react';
import { Spinner, ButtonSpinner, LineSpinner } from '@/components/Spinner';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
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
  Cell,
  Legend
} from 'recharts';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';
import { getProductById, updateProductAIAnalysis } from '@/server/actions/ProductResults';
import { deleteWinningProduct } from '@/server/actions/SaveProduct';
import { Blur } from '@/components/MagicBlur';
import { generateProductAnalysis } from '@/server/actions/AIAnalysis';

const trendData = [
  { name: 'Jan', value: 200 },
  { name: 'Feb', value: 350 },
  { name: 'Mar', value: 480 },
  { name: 'Apr', value: 700 },
  { name: 'May', value: 850 },
  { name: 'Jun', value: 1200 },
];

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const [isMounted, setIsMounted] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function loadProduct() {
      try {
        const result = await getProductById(productId);

        if (result.success && result.data) {
          const productData = result.data as any;
          setProduct(productData);
          if (productData.aiAnalysis && Array.isArray(productData.aiAnalysis) && productData.aiAnalysis.length > 0) {
            setAiAnalysis(productData.aiAnalysis[0]);
          }
        } else {
          setError(result.error || 'Failed to load product intelligence record');
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

  const runAIAnalysis = async () => {
    if (!product) return;
    setIsAnalyzing(true);
    try {
      const res = await generateProductAnalysis({
        keyword: product.keyword,
        pipelineData: product.pipelineData
      });
      if (res.success) {
        setAiAnalysis(res.analysis);
        await updateProductAIAnalysis(productId, res.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <Blur className="flex flex-col items-center justify-center h-[80vh]">
        <LineSpinner > Reconstructing Intelligence Pipeline</LineSpinner>
      </Blur>
    );
  }

  if (error || !product) {
    return (
      <Blur className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-medium text-foreground">Record Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">This intelligence snapshot may have been deleted or the ID is invalid.</p>
        <Link href="/dashboard/saved" className="mt-8">
          <Button variant="outline">Back to Winning Products</Button>
        </Link>
      </Blur>
    );
  }

  const pipeline = product.pipelineData || {};
  const profitability = pipeline.profitability || {};
  const marketIntel = pipeline.marketIntelligence || {};
  const suppliers = pipeline.suppliers?.suppliers || [];
  const competitors = pipeline.competitive?.competitors || [];

  const formattedProfitData = [
    { name: 'Sourcing', value: Number(profitability.wholesalePrice || profitability.costPrice || 0), color: 'var(--brand-blue)' },
    { name: 'Logistics', value: Number(profitability.shippingCost || 0), color: 'var(--brand-cyan)' },
    { name: 'Acquisition', value: Number(profitability.adSpend || 0), color: 'var(--brand-orange)' },
    { name: 'Profit', value: Number(profitability.grossMargin || 0), color: 'var(--brand-emerald)' },
  ];

  const mainImage = product.pipelineData?.imageUrl ||
    competitors.find((c: any) => c.thumbnail || c.favicon)?.thumbnail ||
    competitors.find((c: any) => c.thumbnail || c.favicon)?.favicon ||
    suppliers.find((s: any) => s.thumbnail || s.favicon)?.thumbnail ||
    suppliers.find((s: any) => s.thumbnail || s.favicon)?.favicon ||
    '';

  return (
    <Blur className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Link href="/dashboard/saved">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground shrink-0">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-medium text-foreground tracking-tight">{product.keyword} <span className="text-primary/50 text-xl">({product.region})</span></h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-muted-foreground font-mono">Snapshot ID: {product.id.substring(0, 12).toUpperCase()}</span>
            <Badge variant="emerald">
              Verified Winner
            </Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-medium" onClick={() => window.print()}>
            Export PDF
          </Button>
          <Button glow className="font-medium">
            Launch to Store
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden group shadow-2xl p-0 shadow-primary/5">
            <div className="relative aspect-square ">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.keyword}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ShoppingBag className="w-20 h-20 text-muted-foreground/20" />
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Market Vol.', value: marketIntel.growthTrend || 'Stable', icon: Activity, color: 'text-brand-blue' },
              { label: 'Net Margin', value: `${profitability.marginPercent?.toFixed(1)}%`, icon: DollarSign, color: 'text-brand-emerald' },
              { label: 'Timeframe', value: product.timeframe, icon: Clock, color: 'text-brand-orange' },
              { label: 'Analyzed', value: new Date(product.createdAt).toLocaleDateString(), icon: Target, color: 'text-primary' },
            ].map((stat, i) => (
              <Card key={i} className="p-4 hover:border-primary/20 transition-all">
                <stat.icon className={cn("w-4 h-4 ", stat.color)} />
                <div>

                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <h3 className="text-lg font-medium text-foreground ">{stat.value}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList >
              <TabsTrigger value="overview">Financials</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="competitors">Competition</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
              <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="h-fit border-none shadow-none bg-transparent">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-lg font-medium tracking-tight">EBITDA Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="h-[200px] w-full">
                      {isMounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={formattedProfitData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} vertical={true} opacity={0.5} />
                            <XAxis type="number" hide />
                            <YAxis
                              dataKey="name"
                              type="category"
                              stroke="var(--muted-foreground)"
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
                              width={80}
                            />
                            <Tooltip
                              cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                              contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                borderRadius: '12px',
                                fontSize: '12px',
                                color: 'var(--foreground)',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                              }}
                              itemStyle={{ color: 'var(--foreground)' }}
                              labelStyle={{ color: 'var(--muted-foreground)', fontWeight: 'bold' }}
                            />
                            <Legend
                              verticalAlign="top"
                              align="right"
                              iconType="circle"
                              iconSize={8}
                              wrapperStyle={{
                                fontSize: '11px',
                                paddingBottom: '20px',
                                color: 'var(--foreground)'
                              }}
                              formatter={(value) => <span className="text-foreground ml-1">{value}</span>}
                            />
                            <Bar
                              name="Value ($)"
                              dataKey="value"
                              radius={[0, 6, 6, 0]}
                              barSize={24}
                              animationDuration={1500}
                            >
                              {formattedProfitData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground  ">Retail Price</p>
                          <p className="text-2xl font-medium text-foreground font-mono">
                            ${Number(profitability.retailPrice || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-xs font-medium text-muted-foreground  ">Net Margin</p>
                          <p className="text-2xl font-medium text-brand-emerald font-mono">
                            {profitability.marginPercent?.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                        <div className="space-y-1">
                          <p className="text-[10px] font-medium text-muted-foreground ">Sourcing</p>
                          <p className="text-sm font-medium text-foreground font-mono">-${Number(profitability.wholesalePrice || 0).toFixed(2)}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] font-medium text-muted-foreground ">Marketing (Est.)</p>
                          <p className="text-sm font-medium text-foreground font-mono">-${Number(profitability.adSpend || 5.00).toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-medium text-foreground">Net Profit/Unit</span>
                        <Badge variant="emerald" className="text-lg py-1 px-4 font-mono">
                          +${(Number(profitability.retailPrice || 0) - Number(profitability.wholesalePrice || 0) - Number(profitability.adSpend || 5.00)).toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-primary/5 h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium tracking-tight">Financial Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <p className="text-sm text-muted-foreground font-medium mb-1">ROI Potential</p>
                        <p className="text-xl font-medium text-brand-blue">
                          {profitability.wholesalePrice > 0
                            ? (((profitability.retailPrice - profitability.wholesalePrice) / profitability.wholesalePrice) * 100).toFixed(0)
                            : 0}%
                        </p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <p className="text-sm text-muted-foreground font-medium mb-1">CPA Target</p>
                        <p className="text-xl font-medium text-brand-emerald">
                          ${((profitability.retailPrice - profitability.wholesalePrice) * 0.4).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <p className="text-sm font-medium text-muted-foreground">Scale Projections</p>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-muted-foreground">Conservative (20/day)</span>
                          <span className="font-medium text-foreground">${((profitability.retailPrice - profitability.wholesalePrice) * 20 * 30).toLocaleString()} /mo</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-muted-foreground">Aggressive (100/day)</span>
                          <span className="font-medium text-brand-blue">${((profitability.retailPrice - profitability.wholesalePrice) * 100 * 30).toLocaleString()} /mo</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suppliers" className="outline-none">
              <Card className="shadow-primary/5 p-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-sm font-medium bg-muted/20">
                          <th className="px-6 py-4 font-medium">Wholesaler</th>
                          <th className="px-6 py-4 text-center font-medium">Efficiency</th>
                          <th className="px-6 py-4 font-medium">Unit Cost</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 text-right font-medium">Source</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-border/50">
                        {suppliers.length > 0 ? (
                          suppliers.map((s: any, i: number) => (
                            <tr key={i} className="group hover:bg-muted/30 transition-all">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="size-10 shrink-0 relative">
                                    {s.thumbnail || s.favicon ? (
                                      <Image
                                        src={s.thumbnail || s.favicon}
                                        alt=""
                                        fill
                                        className="object-contain rounded-xl bg-white border border-border"
                                        unoptimized
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <ShoppingBag className="w-full h-full p-2 text-muted-foreground/30" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground leading-tight">{s.supplierName || s.source || 'Verified Factory'}</p>
                                    <p className="text-sm text-muted-foreground font-mono mt-0.5">{s.location || 'Global Sourcing'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-center">
                                <Badge variant="emerald" shape="rounded">
                                  {s.reliabilityScore || 95}%
                                </Badge>
                              </td>
                              <td className="px-6 py-5">
                                <p className="font-medium text-foreground font-mono leading-none">${Number(s.extracted_price || s.costPrice || (Math.random() * 20 + 5)).toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground font-medium mt-1">per unit</p>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                  <div className={cn("size-2 rounded-full", s.is_verified ? "bg-brand-emerald" : "bg-brand-blue")} />
                                  <span className="text-sm font-medium text-muted-foreground">{s.is_verified ? 'Verified' : 'Ready'}</span>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-right">
                                <a href={s.link || s.productUrl} target="_blank" rel="noopener noreferrer">
                                  <Button variant="ghost" size="icon-lg">
                                    <ExternalLink />
                                  </Button>
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-20 text-center text-muted-foreground text-sm font-medium italic opacity-40">No Sourcing intel available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competitors" className="space-y-6 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Competitors</p>
                  <h4 className="text-2xl font-medium text-foreground">{marketIntel.competitorsCount || competitors.length}</h4>
                </Card>
                <Card className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Retail Stores</p>
                  <h4 className="text-2xl font-medium text-brand-blue">{marketIntel.storesCount || 0}</h4>
                </Card>
                <Card className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Market Saturation</p>
                  <h4 className="text-2xl font-medium text-brand-emerald">Low-Medium</h4>
                </Card>
              </div>

              <Card className="shadow-primary/5 p-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-sm font-medium bg-muted/20">
                          <th className="px-6 py-4 font-medium">Retail Competitor</th>
                          <th className="px-6 py-4 text-center font-medium">Platform</th>
                          <th className="px-6 py-4 font-medium">Price</th>
                          <th className="px-6 py-4 font-medium">Trust</th>
                          <th className="px-6 py-4 text-right font-medium">Live</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-border/50">
                        {competitors.length > 0 ? (
                          competitors.map((c: any, i: number) => (
                            <tr key={i} className="group hover:bg-muted/30 transition-all">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="size-10 shrink-0 relative">
                                    {c.thumbnail || c.favicon ? (
                                      <Image
                                        src={c.thumbnail || c.favicon}
                                        alt=""
                                        fill
                                        className="object-contain rounded-xl bg-white border border-border"
                                        unoptimized
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <Activity className="w-full h-full p-2 text-muted-foreground/30" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground line-clamp-1 max-w-[200px]">{c.title || c.sellerName || 'Direct Store'}</p>
                                    <p className="text-sm text-muted-foreground font-mono mt-0.5 truncate max-w-[200px]">{c.source || 'E-Shop'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-center">
                                <Badge variant="blue" shape="rounded">
                                  {c.source || 'Web'}
                                </Badge>
                              </td>
                              <td className="px-6 py-5">
                                <p className="font-medium text-foreground font-mono leading-none">${Number(c.extracted_price || c.retailPrice || 0).toFixed(2)}</p>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-1.5 text-brand-blue font-medium text-sm">
                                  <Star className="w-3.5 h-3.5 fill-brand-blue" /> {c.rating || '4.5'}
                                </div>
                              </td>
                              <td className="px-6 py-5 text-right">
                                <a href={c.link || c.productUrl} target="_blank" rel="noopener noreferrer">
                                  <Button variant="ghost" size="icon-lg">
                                    <ExternalLink />
                                  </Button>
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-20 text-center text-muted-foreground text-sm font-medium italic opacity-40">No Market Competition found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {marketIntel.relatedBrands?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">Market Leader Benchmarks</h4>
                    <div className="flex flex-wrap gap-2">
                      {marketIntel.relatedBrands.map((brand: string, i: number) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1 font-medium">{brand}</Badge>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">Ad Placement Density</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-brand-blue w-[65%]" />
                      </div>
                      <span className="text-sm font-medium text-foreground">6.5/10</span>
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="growth" className="space-y-6 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-brand-blue/5 overflow-hidden border-t-4 border-t-brand-blue">
                  <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-3">
                      <Zap className="w-5 h-5 text-brand-blue" /> Viral Trajectory
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pipeline.trends?.rising?.length > 0 ? (
                      pipeline.trends.rising.map((q: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 group hover:border-brand-blue/30 transition-all">
                          <div>
                            <p className="text-sm font-medium text-foreground capitalize">{q.query}</p>
                            <p className="text-sm text-muted-foreground font-medium mt-0.5">Rising Interest</p>
                          </div>
                          <Badge
                            variant={q.value === 'Breakout' ? "destructive" : "blue"}
                            shape="rounded"
                            className="font-medium"
                          >
                            {q.value}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <Activity className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground text-sm font-medium">No growth anomalies detected</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-brand-emerald/5 overflow-hidden border-t-4 border-t-brand-emerald">
                  <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-3">
                      <Star className="w-5 h-5 text-brand-emerald" /> Evergreen Baseline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pipeline.trends?.top?.length > 0 ? (
                      pipeline.trends.top.map((q: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 group hover:border-brand-emerald/30 transition-all">
                          <div>
                            <p className="text-sm font-medium text-foreground capitalize">{q.query}</p>
                            <p className="text-sm text-muted-foreground font-medium mt-0.5">High Stability</p>
                          </div>
                          <Badge variant="emerald" shape="rounded" className="font-mono">
                            {q.value === '100' ? 'MAX' : q.value}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <Activity className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground text-sm font-medium">No baseline data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="intelligence" className="space-y-8 outline-none mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-brand-blue" />
                  <h3 className="text-xl font-medium text-foreground tracking-tight">AI Audit Results</h3>
                </div>
                <Button
                  onClick={runAIAnalysis}
                  disabled={isAnalyzing}
                  variant="outline"
                  size="sm"
                  className="font-medium"
                >
                  {isAnalyzing ? <ButtonSpinner>Auditing...</ButtonSpinner> : (aiAnalysis ? 'Regenerate Analysis' : 'Run AI Analysis')}
                </Button>
              </div>

              {!aiAnalysis && !isAnalyzing ? (
                <Blur className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-brand-blue/20 blur-[60px] rounded-full animate-pulse" />
                    <div className="relative size-20 bg-muted/50 rounded-[32px] border border-border flex items-center justify-center backdrop-blur-sm">
                      <Zap className="w-10 h-10 text-brand-blue" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-medium text-foreground tracking-tight">Deploy AI Auditor</h3>
                  <p className="text-muted-foreground text-sm mt-3 max-w-md font-medium leading-relaxed">
                    Leverage AI to perform a deep-scan for hidden risks,
                    scaling bottlenecks, and high-conversion marketing angles.
                  </p>
                  <Button
                    size="xl"
                    shape="xl"
                    glow
                    className="mt-10"
                    onClick={runAIAnalysis}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? <ButtonSpinner>Auditing Pulse...</ButtonSpinner> : 'Generate AI Snapshot'}
                  </Button>
                </Blur>
              ) : isAnalyzing && !aiAnalysis ? (
                <Blur className="flex flex-col items-center justify-center py-32 text-center">
                  <LineSpinner>Initializing AI Pipeline...</LineSpinner>
                </Blur>
              ) : (
                <Blur className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <section className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-medium text-muted-foreground  ">Executive Summary</h4>
                        </div>
                        <p className=" text-foreground leading-[1.6] tracking-tight text-lg">
                          {aiAnalysis.summary}
                        </p>
                      </section>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                        <div className="space-y-5">
                          <h5 className="flex items-center gap-2.5 text-sm font-medium text-brand-emerald">
                            <CheckCircle2 className="w-4 h-4" /> Market Pros
                          </h5>
                          <ul className="space-y-4">
                            {aiAnalysis.pros?.map((pro: string, i: number) => (
                              <li key={i} className="flex gap-4 text-sm font-medium text-muted-foreground leading-relaxed">
                                <span className="mt-2.5 size-1.5 rounded-full bg-brand-emerald/40 shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-5">
                          <h5 className="flex items-center gap-2.5 text-sm font-medium text-destructive">
                            <AlertCircle className="w-4 h-4" /> Scalability Cons
                          </h5>
                          <ul className="space-y-4">
                            {aiAnalysis.cons?.map((con: string, i: number) => (
                              <li key={i} className="flex gap-4 text-sm font-medium text-muted-foreground leading-relaxed">
                                <span className="mt-2.5 size-1.5 rounded-full bg-destructive/40 shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Card className="p-6 bg-muted/20 border-border/50 shadow-none">
                        <p className="text-xs font-medium text-muted-foreground  ">Core Targeting</p>
                        <p className="text-sm font-medium text-foreground leading-relaxed">{aiAnalysis.targetAudience}</p>
                      </Card>
                      <Card className="p-6 bg-muted/20 border-border/50 shadow-none">
                        <p className="text-xs font-medium text-muted-foreground  ">Marketing Angle</p>
                        <p className="text-sm font-medium text-foreground leading-relaxed">{aiAnalysis.marketingAngle}</p>
                      </Card>
                      <Card className="p-6 bg-brand-blue/5 border-brand-blue/10 shadow-none group">
                        <div className="flex justify-between items-center ">
                          <p className="text-xs font-medium text-brand-blue ">Scaling Potential</p>
                          <TrendingUp className="w-4 h-4 text-brand-blue" />
                        </div>
                        <p className="text-2xl font-medium text-foreground">{aiAnalysis.scalingPotential}</p>
                      </Card>
                    </div>
                  </div>
                </Blur>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Blur>
  );
}


