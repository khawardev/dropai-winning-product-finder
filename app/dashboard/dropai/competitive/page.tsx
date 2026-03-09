'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function CompetitiveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q');
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competitiveResults, setCompetitiveResults] = useState<any>(null);

  useEffect(() => {
    if (!keyword) {
      setError("No keyword provided.");
      setIsAnalyzing(false);
      return;
    }

    const fetchCompetitiveData = async () => {
      try {
        const response = await fetch(`/api/research/competitive?q=${encodeURIComponent(keyword)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch competitive data');
        }

        const data = await response.json();
        setCompetitiveResults(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during competitive analysis.');
      } finally {
        setIsAnalyzing(false);
      }
    };

    fetchCompetitiveData();
  }, [keyword]);

  const handleProceedToSuppliers = (imageUrl?: string) => {
    let target = `/dashboard/dropai/suppliers?q=${encodeURIComponent(keyword || '')}`;
    if (imageUrl) {
      target += `&url=${encodeURIComponent(imageUrl)}`;
    }
    router.push(target);
  };

  if (!keyword) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-muted-foreground">Missing Keyword. Please go back and start a new search.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/dropai')}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">DropAI Workflow (Phase 1)</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Step 2: Competitive Market Setup for <strong className="text-primary">{keyword}</strong>
          </p>
        </div>
      </div>

      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Paid & Organic Landscape
          </CardTitle>
          <CardDescription>Scanning Google Shopping and Shopify stores for competitors.</CardDescription>
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
              <p className="text-muted-foreground">Scanning Google Shopping & Organic Shopify Stores...</p>
            </div>
          ) : competitiveResults ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-foreground">
                      ${competitiveResults.avgPrice > 0 ? competitiveResults.avgPrice.toFixed(2) : '0.00'}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Avg Market Price</span>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-foreground">
                      {competitiveResults.competitors?.length || 0}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Shopping Competitors</span>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-foreground">
                      {competitiveResults.shopifyStores?.length || 0}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Shopify Stores Spy</span>
                  </CardContent>
                </Card>
              </div>

              {/* Shopping Competitors Display */}
              {competitiveResults.competitors && competitiveResults.competitors.length > 0 && (
                <div className="space-y-3 pt-6">
                  <h3 className="font-semibold text-lg border-b pb-2">🛒 Top Shopping Competitors</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-[600px] overflow-y-auto pr-2 pb-4">
                    {competitiveResults.competitors.map((item: any, i: number) => (
                      <Card key={i} className="flex flex-col overflow-hidden bg-background border-border relative">
                        {item.tag && (
                          <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm">{item.tag}</div>
                        )}
                        <div className="aspect-square relative overflow-hidden group border-b bg-muted/20">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                              <span className="text-muted-foreground text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-2 mb-4">
                            <a href={item.product_link || item.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors" title={item.title}>
                              {item.title}
                            </a>
                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                              {item.source_icon && (
                                <img src={item.source_icon} alt={item.source} className="w-3.5 h-3.5 rounded-full" />
                              )}
                              <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-sm inline-block uppercase tracking-wider">{item.source}</span>
                              {item.rating && (
                                <span className="text-[10px] flex items-center gap-0.5 text-yellow-500 font-medium bg-yellow-500/10 px-1.5 py-0.5 rounded-sm">
                                  ⭐ {item.rating} {item.reviews ? `(${item.reviews})` : ''}
                                </span>
                              )}
                            </div>
                            {item.delivery && <p className="text-[10px] text-emerald-500">{item.delivery}</p>}
                            {item.second_hand_condition && <p className="text-[10px] text-orange-500 capitalize">Condition: {item.second_hand_condition}</p>}
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                              <span className="font-bold text-lg text-primary">{item.price || (item.extracted_price ? `$${item.extracted_price.toFixed(2)}` : '---')}</span>
                              {item.old_price && <span className="text-[10px] text-muted-foreground line-through">{item.old_price}</span>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Shopify Stores Display */}
              {competitiveResults.shopifyStores && competitiveResults.shopifyStores.length > 0 && (
                <div className="space-y-3 pt-6">
                  <h3 className="font-semibold text-lg border-b pb-2">🛍️ Organic Shopify Stores (Spy)</h3>
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                    {competitiveResults.shopifyStores.map((store: any, i: number) => (
                      <div key={i} className="flex flex-col p-4 bg-secondary/30 rounded-md border border-border transition-colors hover:bg-secondary/50">
                        <div className="flex items-start gap-2 mb-1">
                          {store.favicon && (
                            <img src={store.favicon} alt="Favicon" className="w-4 h-4 mt-0.5 rounded-sm" />
                          )}
                          <a href={store.link} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline line-clamp-1 flex-1" title={store.title}>
                            {store.title}
                          </a>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{store.snippet}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-2 truncate">{store.displayed_link || store.link}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state protection */}
              {(!competitiveResults.competitors || competitiveResults.competitors.length === 0) && (!competitiveResults.shopifyStores || competitiveResults.shopifyStores.length === 0) && (
                <div className="p-8 text-center text-muted-foreground border rounded-lg bg-muted/20">
                  <p>No competitor data found for this product.</p>
                </div>
              )}

              <div className="pt-6 flex justify-end">
                <Button 
                  onClick={() => {
                    const firstCompetitorImg = competitiveResults.competitors?.[0]?.thumbnail;
                    handleProceedToSuppliers(firstCompetitorImg);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Proceed to Supplier Discovery <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <div className="mt-8 border-t pt-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Raw JSON Output - Competitive</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-[11px] font-mono text-muted-foreground">
                  {JSON.stringify(competitiveResults, null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CompetitivePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading Competitive Market...</p>
      </div>
    }>
      <CompetitiveContent />
    </Suspense>
  );
}
