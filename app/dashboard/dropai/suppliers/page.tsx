'use client';

import React, { useEffect, useState, Suspense, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { Spinner, ButtonSpinner } from '@/components/Spinner';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { analyzeAndSaveWinningProduct } from '@/server/actions/DropAiActions';
import { Blur } from '@/components/MagicBlur';

function SuppliersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q');
  const imageUrl = searchParams.get('url');

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierResults, setSupplierResults] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [competitorsContext, setCompetitorsContext] = useState<any>(null);

  // We need to fetch the competitive data again here or theoretically pass it through context/state.
  // For Phase 1 routing, we will dynamically fetch competitive stats here again to do the profit math,
  // since this is a stateless flow. Or we can just calculate margin against 0 if we don't fetch it.
  // We will run the competitive fetch again strictly for the average price variable.
  const [retailPrice, setRetailPrice] = useState<number>(0);

  useEffect(() => {
    if (!keyword && !imageUrl) {
      setError("No search parameters provided.");
      setIsAnalyzing(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Fetch Suppliers
        const params = new URLSearchParams();
        if (keyword) params.set('q', keyword);
        if (imageUrl) params.set('url', imageUrl);

        const supRes = await fetch(`/api/research/suppliers?${params.toString()}`);
        if (!supRes.ok) throw new Error('Failed to fetch supplier data');
        const supData = await supRes.json();
        setSupplierResults(supData);

        // 2. Fetch or Load Competitive Price
        const cachedComp = sessionStorage.getItem('dropai_competitive_results');
        if (cachedComp) {
          try {
            const parsed = JSON.parse(cachedComp);
            setRetailPrice(parsed.avgPrice || 0);
            setCompetitorsContext(parsed);
          } catch (e) { }
        } else if (keyword) {
          const compRes = await fetch(`/api/research/competitive?q=${encodeURIComponent(keyword)}`);
          if (compRes.ok) {
            const compData = await compRes.json();
            setRetailPrice(compData.avgPrice || 0);
            setCompetitorsContext(compData);
            sessionStorage.setItem('dropai_competitive_results', JSON.stringify(compData));
          }
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsAnalyzing(false);
      }
    };

    fetchData();
  }, [keyword, imageUrl]);

  const handleSaveAsWinningProduct = () => {
    if (!supplierResults || (!keyword && !imageUrl)) return;

    startTransition(async () => {
      // 1. Gather Trend Data if available
      let trendsData = {};
      const cachedTrends = sessionStorage.getItem('dropai_trend_results');
      if (cachedTrends) {
        try {
          trendsData = JSON.parse(cachedTrends);
        } catch (e) { }
      }

      // 2. Gather pipeline data
      const pipelineData = {
        trends: trendsData,
        competitive: competitorsContext,
        marketIntelligence: {
          avgPrice: retailPrice,
          competitorsCount: (competitorsContext as any)?.competitors?.length || 0,
          storesCount: ((competitorsContext as any)?.marketplaceStores?.length || 0) + ((competitorsContext as any)?.shopifyStores?.length || 0),
        },
        suppliers: supplierResults,
        profitability: {
          retailPrice: retailPrice,
          wholesalePrice: supplierResults.lowestPrice || 0,
          grossMargin: retailPrice - (supplierResults.lowestPrice || 0),
          marginPercent: retailPrice > 0 ? ((retailPrice - (supplierResults.lowestPrice || 0)) / retailPrice) * 100 : 0,
          verdict: signal
        }
      };

      const result = await analyzeAndSaveWinningProduct({
        keyword: keyword || 'Image Search Product',
        region: 'US', // default or pass down
        timeframe: 'today 1-m', // default or pass down
        pipelineData,
        imageUrl: imageUrl || undefined
      });

      if (result.success && result.productId) {
        router.push(`/dashboard/saved`); // Redirect to the new dashboard route
      } else {
        setError(result.error || 'Failed to save product');
      }
    });
  };

  if (!keyword && !imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-muted-foreground">Missing Parameters. Please go back.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/dropai')}>
          Start Over
        </Button>
      </div>
    );
  }

  // Profit Math
  const wholesale = supplierResults?.lowestPrice || 0;
  const grossMargin = retailPrice - wholesale;
  const marginPercent = retailPrice > 0 ? (grossMargin / retailPrice) * 100 : 0;

  let signal = '';
  let signalColor = '';
  if (marginPercent < 20) { signal = 'Avoid — too thin'; signalColor = 'text-red-500'; }
  else if (marginPercent < 40) { signal = 'Viable but competitive'; signalColor = 'text-yellow-500'; }
  else if (marginPercent < 60) { signal = 'Good opportunity'; signalColor = 'text-emerald-500'; }
  else { signal = 'Strong opportunity'; signalColor = 'text-emerald-600 font-medium'; }


  return (
    <Blur className="mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-medium text-foreground tracking-tight">DropAI Sourcing Engine</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Analyzing <span className="text-primary font-medium">{keyword || "Image Search Snapshot"}</span>
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Badge variant="blue" shape="rounded">
            <div className="size-1.5 rounded-full bg-primary animate-pulse mr-1" />
            Live Marketplace Audit
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 shadow-2xl shadow-primary/5 overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-medium tracking-tight flex items-center gap-2">
                  <Zap className="size-5 text-primary" /> Profitability Verdict
                </CardTitle>
                <CardDescription className="text-sm font-medium mt-1">Calculated against market average: ${retailPrice.toFixed(2)}</CardDescription>
              </div>
              <Badge
                variant={marginPercent > 40 ? "emerald" : "orange"}
                shape="pill"
                className="px-4 py-1"
              >
                {signal}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <div className="p-4 mb-8 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-medium  flex items-center gap-3">
                <div className="size-2 rounded-full bg-destructive animate-pulse" />
                {error}
              </div>
            )}

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 scale-150"></div>
                  <div className="relative size-20 bg-primary rounded-3xl flex items-center justify-center rotate-3 shadow-2xl shadow-primary/40">
                    <Spinner />
                  </div>
                </div>
                <div>
                  <p className="text-foreground font-medium text-lg tracking-tight">Accessing Global Supply Chains</p>
                  <p className="text-muted-foreground text-sm font-medium mt-2">Syncing with Google Lens & Ali-Intelligence Labs...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Market Price', value: `$${retailPrice.toFixed(2)}`, color: 'text-foreground' },
                    { label: 'COGS (Min)', value: `$${wholesale.toFixed(2)}`, color: 'text-primary' },
                    { label: 'Net Unit Profit', value: `$${grossMargin.toFixed(2)}`, color: 'text-brand-emerald' },
                    { label: 'Profit Margin', value: `${marginPercent.toFixed(1)}%`, color: signalColor },
                  ].map((stat, i) => (
                    <div key={i} className="bg-muted/30 border border-border/50 p-6 rounded-3xl flex flex-col items-center text-center group hover:border-primary/30 transition-all">
                      <span className={cn("text-2xl font-medium tracking-tighter", stat.color)}>{stat.value}</span>
                      <span className="text-sm text-muted-foreground font-medium mt-1">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {supplierResults?.suppliers?.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <h3 className="font-medium text-sm flex items-center gap-2">
                        Verified Wholesalers
                      </h3>
                      <span className="text-sm font-medium text-muted-foreground">{supplierResults.suppliers.length} Sources Found</span>
                    </div>

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                      {supplierResults.suppliers
                        .filter((item: any) => item.title && (item.thumbnail || item.extracted_price || item.price))
                        .slice(0, 9)
                        .map((item: any, i: number) => (
                          <Card key={i} className={cn(
                            "flex flex-col overflow-hidden group relative hover:border-primary/30 transition-all duration-500",
                            item.is_verified && "ring-2 ring-primary/20 border-primary/30"
                          )}>
                            <div className="aspect-4/3 relative overflow-hidden">
                              {item.thumbnail ? (
                                <Image
                                  src={item.thumbnail}
                                  alt={item.title}
                                  fill
                                  className="object-contain transition-transform duration-700 group-hover:scale-110 bg-white border-b border-border/50"
                                  unoptimized
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <ShoppingBag className="size-10 text-muted-foreground/20" />
                                </div>
                              )}
                              {item.is_verified && (
                                <div className="absolute top-3 right-3">
                                  <div className="bg-emerald-500 text-white text-sm font-black  py-1 px-2 rounded-lg shadow-xl flex items-center gap-1">
                                    <div className="size-1 rounded-full bg-white animate-pulse" /> Verified
                                  </div>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-5 flex-1 flex flex-col">
                              <div className="space-y-3 mb-6">
                                <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">{item.title}</p>

                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" shape="rounded">
                                    {item.source || 'Direct'}
                                  </Badge>
                                  {item.rating && (
                                    <Badge variant="orange" shape="rounded">
                                      ⭐ {item.rating}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-muted-foreground mb-1 opacity-50">Sourcing Price</span>
                                  <span className="font-medium text-lg text-emerald-500 tracking-tighter">
                                    {item.extracted_price ? `$${item.extracted_price.toFixed(2)}` :
                                      (typeof item.price === 'string' ? item.price :
                                        (item.price?.extracted_value ? `$${item.price.extracted_value}` : 'N/A'))}
                                  </span>
                                </div>
                                <Button variant="ghost" size="icon-sm" onClick={() => window.open(item.link, '_blank')}>
                                  <ExternalLink className="size-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 shadow-2xl shadow-primary/5">
            <h3 className="text-sm font-medium text-primary tracking-tight mb-4 flex items-center gap-2">
              <Bookmark className="size-4" /> Data Pipeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Competitive Benchmarked</p>
                  <p className="text-sm font-medium text-muted-foreground">{competitorsContext?.competitors?.length || 0} Stores Identified</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Supply Chain Mapped</p>
                  <p className="text-sm font-medium text-muted-foreground">{supplierResults?.suppliers?.length || 0} Factories Found</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Trend Signals Locked</p>
                  <p className="text-sm font-medium text-muted-foreground">Google Search Index Synced</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-primary/10">
              <Button
                disabled={isPending || !supplierResults}
                onClick={handleSaveAsWinningProduct}
                size="xl"
                shape="xl"
                glow
                className="w-full font-medium"
              >
                {isPending ? (
                  <ButtonSpinner>Finalizing...</ButtonSpinner>
                ) : (
                  <>Deploy Product <ArrowRight className="ml-2 size-4" /></>
                )}
              </Button>
              <p className="text-sm text-center text-primary/60 font-medium mt-4">Adds full intelligence profile to dashboard</p>
            </div>
          </Card>

          <Button
            variant="ghost"
            className="w-full rounded-2xl text-muted-foreground hover:text-foreground text-sm font-black "
            onClick={() => router.push('/dashboard/dropai')}
          >
            Discard Search & Restart
          </Button>
        </div>
      </div>
    </Blur>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Spinner />
        <p className="text-muted-foreground">Loading Supplier Data...</p>
      </div>
    }>
      <SuppliersContent />
    </Suspense>
  );
}
