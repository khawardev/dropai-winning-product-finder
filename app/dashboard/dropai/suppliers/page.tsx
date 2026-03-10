'use client';

import React, { useEffect, useState, Suspense, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { analyzeAndSaveWinningProduct } from '@/server/actions/DropAiActions';

function SuppliersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q');
  const imageUrl = searchParams.get('url');
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierResults, setSupplierResults] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [competitorsContext, setCompetitorsContext] = useState<any[]>([]);
  
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

        // 2. Fetch Competitive Price (for margin calculation missing from previous steps)
        if (keyword) {
           const compRes = await fetch(`/api/research/competitive?q=${encodeURIComponent(keyword)}`);
           if (compRes.ok) {
             const compData = await compRes.json();
             setRetailPrice(compData.avgPrice || 0);
             setCompetitorsContext(compData.competitors || []);
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
      const result = await analyzeAndSaveWinningProduct({
        keyword: keyword || 'Image Search Product',
        imageUrl: imageUrl || undefined,
        retailPrice: retailPrice,
        wholesalePrice: supplierResults.lowestPrice || 0,
        suppliers: supplierResults.suppliers || [],
        competitors: competitorsContext
      });

      if (result.success && result.productId) {
        router.push(`/dashboard/results?id=${result.productId}`);
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
  else { signal = 'Strong opportunity'; signalColor = 'text-emerald-600 font-bold'; }


  return (
    <div className="mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">DropAI Workflow (Phase 1)</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Step 3: Supplier & Profit Analysis for <strong className="text-primary">{keyword || "Image Search"}</strong>
          </p>
        </div>
      </div>

      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            Profit Margin Calculator
          </CardTitle>
          <CardDescription>Analyzing potential suppliers and competitive retail pricing.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 mb-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                <div className="relative w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
                </div>
              </div>
              <p className="text-muted-foreground">Scanning Google Lens & AliExpress for Wholesale Sources...</p>
            </div>
          ) : supplierResults ? (
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted p-4 rounded-lg flex flex-col items-center text-center">
                      <span className="text-2xl font-bold">${retailPrice.toFixed(2)}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Avg Retail Price</span>
                  </div>
                  <div className="bg-muted p-4 rounded-lg flex flex-col items-center text-center">
                      <span className="text-2xl font-bold">${wholesale.toFixed(2)}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Lowest Wholesale</span>
                  </div>
                  <div className="bg-muted p-4 rounded-lg flex flex-col items-center text-center">
                      <span className="text-2xl font-bold">${grossMargin.toFixed(2)}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Gross Margin</span>
                  </div>
                  <div className="bg-muted p-4 rounded-lg flex flex-col items-center text-center">
                      <span className={cn("text-2xl font-bold", signalColor)}>{marginPercent.toFixed(1)}%</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Margin %</span>
                  </div>
                  
                  <div className="col-span-2 md:col-span-4 mt-2 text-center p-3 rounded-md bg-secondary/50 border border-border">
                    <span className="text-sm">Verdict: <strong className={signalColor}>{signal}</strong></span>
                  </div>
              </div>

              {/* Wholesale Suppliers Display */}
              {supplierResults.suppliers && supplierResults.suppliers.length > 0 && (
                <div className="space-y-3 pt-6">
                  <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
                    📦 Wholesale Source Intelligence
                    <Badge variant="secondary" className="text-[10px]">Verified Platforms</Badge>
                  </h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-[700px] overflow-y-auto pr-2 pb-4">
                    {supplierResults.suppliers
                      .filter((item: any) => item.title && (item.thumbnail || item.extracted_price || item.price))
                      .map((item: any, i: number) => (
                      <Card key={i} className={cn(
                        "flex flex-col overflow-hidden bg-background border-border group relative",
                        item.is_verified && "border-primary/40 ring-1 ring-primary/20"
                      )}>
                        {item.is_verified && (
                          <div className="absolute top-2 right-2 z-10">
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none text-[9px] font-bold uppercase py-0.5 px-1.5 shadow-sm">
                              Verified
                            </Badge>
                          </div>
                        )}
                        <div className="aspect-square relative overflow-hidden border-b bg-muted/20">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                              <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight px-4 text-center">{item.title}</span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-2 mb-4">
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors" title={item.title}>
                              {item.title}
                            </a>
                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                              {item.source_icon && (
                                <img src={item.source_icon} alt={item.source || 'source'} className="w-3.5 h-3.5 rounded-full" />
                              )}
                              <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-sm inline-block uppercase tracking-wider">
                                {item.source || (item.link?.includes('aliexpress') ? 'AliExpress' : (item.link?.includes('alibaba') ? 'Alibaba' : 'Wholesaler'))}
                              </span>
                              {item.rating && (
                                <span className="text-[10px] flex items-center gap-0.5 text-yellow-500 font-medium bg-yellow-500/10 px-1.5 py-0.5 rounded-sm">
                                  ⭐ {item.rating} {item.reviews ? `(${item.reviews})` : ''}
                                </span>
                              )}
                            </div>
                            {(item.in_stock || item.stock) && <p className="text-[10px] text-emerald-500">In Stock</p>}
                            {item.delivery && <p className="text-[10px] text-muted-foreground italic truncate">{item.delivery}</p>}
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                              <span className="font-bold text-lg text-emerald-500">
                                {item.extracted_price ? `$${item.extracted_price.toFixed(2)}` : 
                                 (typeof item.price === 'string' ? item.price : 
                                  (item.price?.extracted_value ? `$${item.price.extracted_value}` : 'N/A'))}
                              </span>
                              {item.is_verified && <span className="text-[9px] text-muted-foreground/80 uppercase font-medium tracking-tighter">Factory Direct Price</span>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex gap-1.5">
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-[9px] font-bold uppercase text-primary hover:bg-primary/10 border border-primary/5" onClick={() => {
                                  try {
                                    const url = new URL(item.link);
                                    const domain = url.hostname;
                                    const name = encodeURIComponent(item.source || 'Wholesale Supplier');
                                    const image = encodeURIComponent(item.source_icon || item.thumbnail || '');
                                    const source = encodeURIComponent(item.source || 'Wholesale');
                                    router.push(`/dashboard/dropai/library?domain=${domain}&name=${name}&image=${image}&source=${source}&type=Wholesaler`);
                                  } catch (e) {
                                    router.push(`/dashboard/dropai/library?domain=${item.source || 'supplier'}&name=${encodeURIComponent(item.source || 'Wholesale Supplier')}&source=Wholesale&type=Wholesaler`);
                                  }
                                }}>
                                  Catalog
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 px-2 text-[9px] font-bold uppercase border-primary/20 hover:bg-primary hover:text-primary-foreground" onClick={() => {
                                  try {
                                    const url = new URL(item.link);
                                    router.push(`/dashboard/dropai/library?domain=${url.hostname}&name=${encodeURIComponent(item.source || 'Wholesale Supplier')}&image=${encodeURIComponent(item.source_icon || item.thumbnail || '')}&source=${encodeURIComponent(item.source || 'Wholesale')}&type=Wholesaler`);
                                  } catch (e) {
                                    router.push(`/dashboard/dropai/library?domain=${item.source || 'supplier'}&name=${encodeURIComponent(item.source || 'Wholesale Supplier')}&type=Wholesaler`);
                                  }
                                }}>
                                  Save Wholesaler
                                </Button>
                              </div>
                              <Button size="sm" variant="secondary" className="h-7 text-[9px] font-bold uppercase w-full bg-muted/50" asChild>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">Official Link</a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Wholesale Spy Display */}
              {supplierResults.raw_organic?.organic_results?.length > 0 && (
                <div className="space-y-3 pt-6">
                  <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
                    🔍 Direct Wholesale Spy
                    <Badge variant="outline" className="text-[10px]">Dropshipping Platforms</Badge>
                  </h3>
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                    {supplierResults.raw_organic.organic_results.map((result: any, i: number) => (
                      <div key={i} className="flex flex-col p-4 bg-secondary/20 rounded-md border border-border transition-colors hover:bg-secondary/40">
                        <a href={result.link} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline line-clamp-1 flex-1" title={result.title}>
                          {result.title}
                        </a>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{result.snippet}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-[10px] text-muted-foreground/60 truncate max-w-[200px]">{result.displayed_link || result.link}</p>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px]" asChild>
                            <a href={result.link} target="_blank" rel="noopener noreferrer">Source Details</a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => router.push('/dashboard/dropai')}
                >
                  Start New Search
                </Button>
                <Button 
                  disabled={isPending || !supplierResults}
                  onClick={handleSaveAsWinningProduct}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <>Save as Winning Product (Phase 2) <ArrowRight className="ml-2 w-4 h-4" /></>
                  )}
                </Button>
              </div>

              <div className="mt-8 border-t pt-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Raw JSON Output - Suppliers ({supplierResults.method})</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-[11px] font-mono text-muted-foreground max-h-96">
                  {JSON.stringify(supplierResults, null, 2)}
                </pre>
              </div>

            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading Supplier Data...</p>
      </div>
    }>
      <SuppliersContent />
    </Suspense>
  );
}
