'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Zap, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { Spinner, ButtonSpinner } from '@/components/Spinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Globe, Clock } from 'lucide-react';
import { Blur } from '@/components/MagicBlur';

export default function DropAI() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trendResults, setTrendResults] = useState<any>(null);

  const handleTrendSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const keyword = formData.get('keyword') as string;
    const geo = formData.get('geo') as string;
    const date = formData.get('date') as string;

    if (!keyword) return;

    setIsSearching(true);
    setError(null);
    setTrendResults(null);

    try {
      const response = await fetch(`/api/research/trends?q=${encodeURIComponent(keyword)}&geo=${geo}&date=${encodeURIComponent(date)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trends');
      }

      const data = await response.json();
      setTrendResults(data);
      sessionStorage.setItem('dropai_trend_results', JSON.stringify(data));

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleProceedToCompetitive = (keyword: string) => {
    sessionStorage.setItem('dropai_selected_keyword', keyword);
    router.push(`/dashboard/dropai/competitive?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <Blur className="mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-medium text-foreground">Product Finder (Phase 1)</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Step 1: Trend Discovery
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Input Panel */}
        <div className="xl:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                Discovery Engine
              </CardTitle>
              <CardDescription>Target emerging niches before they go viral.</CardDescription>
            </CardHeader>
            <CardContent >
              <form onSubmit={handleTrendSearch} className="space-y-6">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Search className="w-4 h-4 text-primary" /> Seed Keyword
                  </label>
                  <Input
                    name="keyword"
                    placeholder="e.g. coffee, kitchen toys, beauty"
                    className="bg-muted/50 border-border"
                    required
                    disabled={isSearching}
                  />
                  <p className="text-sm text-muted-foreground">Broader terms yield better breakout results.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" /> Region
                    </label>
                    <select name="geo" className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                      <option value="US">🇺🇸 USA</option>
                      <option value="GB">🇬🇧 UK</option>
                      <option value="CA">🇨🇦 Canada</option>
                      <option value="AU">🇦🇺 Australia</option>
                      <option value="FR">🇫🇷 France</option>
                      <option value="DE">🇩🇪 Germany</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" /> Timeframe
                    </label>
                    <select name="date" className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                      <option value="today 3-m">3 Months</option>
                      <option value="today 12-m">12 Months</option>
                      <option value="today 1-m">30 Days</option>
                      <option value="now 7-d">7 Days</option>
                      <option value="now 1-d">24 Hours</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSearching}
                  size="xl"
                  glow
                  className="w-full"
                >
                  {isSearching ? (
                    <ButtonSpinner>Analyzing...</ButtonSpinner>
                  ) : (
                    <>
                      <TrendingUp />
                      Find Breakout Niches
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="h-full min-h-[400px]">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                Raw Output & Validations
              </CardTitle>
              <CardDescription>Validating the data flow for Trend Discovery.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 animate-ping rounded-full bg-muted/20"></div>
                    <div className="relative w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Spinner />
                    </div>
                  </div>
                  <p className="text-muted-foreground">Scanning Google Trends...</p>
                </div>
              ) : trendResults ? (
                <div className="space-y-6">
                  {/* Summary Metric */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-border/50">
                      <span className="text-3xl font-medium text-foreground tracking-tighter">{trendResults.breakouts?.length || 0}</span>
                      <span className="text-sm text-muted-foreground mt-1 font-medium">Breakouts</span>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-border/50">
                      <span className="text-3xl font-medium text-foreground tracking-tighter">{trendResults.rising?.length || 0}</span>
                      <span className="text-sm text-muted-foreground mt-1 font-medium">Rising Queries</span>
                    </div>
                  </div>

                  {/* Highlights section */}

                  {/* Breakouts */}
                  {trendResults.breakouts && trendResults.breakouts.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-lg border-b pb-2">🔥 Potential Winning Niches (Breakouts)</h3>
                      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                        {trendResults.breakouts.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-secondary/50 rounded-md border border-border">
                            <span className="font-medium text-sm truncate mr-2" title={item.query}>{item.query}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="emerald" shape="rounded">
                                {item.value}
                              </Badge>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleProceedToCompetitive(item.query)}
                              >
                                Analyze Setup <ArrowRight className="ml-1 w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rising Queries */}
                  {trendResults.rising && trendResults.rising.length > 0 && (
                    <div className="space-y-3 pt-4">
                      <h3 className="font-medium text-lg border-b pb-2">📈 Rising Queries</h3>
                      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                        {trendResults.rising.slice(0, 10).map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-secondary/20 rounded-md border border-border">
                            <span className="font-medium text-sm truncate mr-2" title={item.query}>{item.query}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="blue" shape="rounded">
                                {item.value}
                              </Badge>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleProceedToCompetitive(item.query)}
                              >
                                Analyze <ArrowRight className="ml-1 w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Queries */}
                  {trendResults.top && trendResults.top.length > 0 && (
                    <div className="space-y-3 pt-4">
                      <h3 className="font-medium text-lg border-b pb-2">⭐ Top Queries</h3>
                      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                        {trendResults.top.slice(0, 10).map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-secondary/20 rounded-md border border-border">
                            <span className="font-medium text-sm truncate mr-2" title={item.query}>{item.query}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge shape="rounded">
                                Score: {item.value}
                              </Badge>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleProceedToCompetitive(item.query)}
                              >
                                Analyze <ArrowRight className="ml-1 w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state if nothing found */}
                  {trendResults.rising?.length === 0 && trendResults.top?.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground border rounded-lg bg-muted/20">
                      <p>No related queries or breakouts found for this keyword.</p>
                      <p className="text-sm mt-2">Try a different, broader seed keyword.</p>
                    </div>
                  )}

                  {/* Raw JSON dump for dev phase */}
                  {/* <div className="mt-8 border-t pt-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex justify-between items-center">
                      <span>Raw JSON Output</span>
                    </h3>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono text-muted-foreground">
                      {JSON.stringify(trendResults, null, 2)}
                    </pre>
                  </div> */}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-50">
                  <TrendingUp className="w-12 h-12 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Configure search on the left to view data.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Blur>
  );
}
