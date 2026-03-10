'use client';

import React, { useEffect, useState, Suspense, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, Globe, ExternalLink, Package, AlertCircle, ArrowLeft, Search, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { getSavedSellers, saveSeller, removeSavedSeller } from '@/server/actions/DropAiActions';

function LibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [savedSuppliers, setSavedSuppliers] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'Competitor' | 'Wholesaler'>('all');
  const [isPending, startTransition] = useTransition();

  // Get data from URL
  const domain = searchParams.get('domain');
  const name = searchParams.get('name');
  const image = searchParams.get('image');
  const source = searchParams.get('source');
  const type = searchParams.get('type') || 'Competitor'; // Default to Competitor

  useEffect(() => {
    startTransition(async () => {
      const result = await getSavedSellers();
      if (result.success) {
        setSavedSuppliers(result.data as any[]);
      }
    });
  }, []);

  // Auto-save if new data is passed via URL
  useEffect(() => {
    if (domain && name) {
      const exists = savedSuppliers.find(s => s.domain === domain);
      if (!exists) {
        startTransition(async () => {
          const result = await saveSeller({
            domain,
            name,
            image: image || undefined,
            source: source || undefined,
            type
          });
          if (result.success && !result.alreadySaved) {
            const updatedResult = await getSavedSellers();
            if (updatedResult.success) {
               setSavedSuppliers(updatedResult.data as any[]);
            }
          }
        });
      }
    }
  }, [domain, name, image, source, type, savedSuppliers]);

  const fetchProducts = async (targetDomain: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/research/seller?domain=${encodeURIComponent(targetDomain)}`);
      if (!response.ok) throw new Error('Failed to fetch store products');
      const data = await response.json();
      setProducts(data.results || []);
    } catch (err: any) {
      setError("Could not retrieve store products. Merchant may be private.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSupplier = async (targetDomain: string) => {
    startTransition(async () => {
      const result = await removeSavedSeller(targetDomain);
      if (result.success) {
        const updatedResult = await getSavedSellers();
        if (updatedResult.success) {
           setSavedSuppliers(updatedResult.data as any[]);
        }
        if (domain === targetDomain) {
          router.push('/dashboard/dropai/library');
        }
      }
    });
  };

  const filteredSuppliers = savedSuppliers.filter(s => 
    filter === 'all' ? true : s.type === filter
  );

  // 1. All Saved Suppliers Grid (Default View)
  if (!domain) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Supplier Library</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage and track your winning product sources & competitors.</p>
          </div>
          <Button onClick={() => router.push('/dashboard/dropai')} variant="outline" className="gap-2 border-primary/20">
            <Search className="w-4 h-4" /> Discovery Hub
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex p-1 bg-muted/50 rounded-xl w-fit border border-primary/5">
          {(['all', 'Competitor', 'Wholesaler'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === t 
                  ? 'bg-background text-primary shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'all' ? 'All Sources' : t === 'Competitor' ? 'Market Competitors' : 'Wholesale Suppliers'}
            </button>
          ))}
        </div>

        {filteredSuppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier, i) => (
              <Card key={i} className="group overflow-hidden border-primary/5 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5">
                <CardContent className="p-0">
                  <div className="p-6 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 overflow-hidden relative">
                      {supplier.image ? (
                        <img src={supplier.image} alt={supplier.name} className="w-full h-full object-cover" />
                      ) : (
                        <Globe className="w-8 h-8 text-primary/40" />
                      )}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${supplier.type === 'Wholesaler' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`text-[8px] uppercase tracking-tighter px-1.5 h-4 ${
                          supplier.type === 'Wholesaler' 
                            ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' 
                            : 'border-blue-500/30 text-blue-500 bg-blue-500/5'
                        }`}>
                          {supplier.type}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors leading-tight">{supplier.name}</h3>
                      <p className="text-[10px] text-muted-foreground truncate opacity-70 italic">{supplier.domain}</p>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-muted/30 border-t border-primary/5 flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[10px] font-bold uppercase h-8"
                      onClick={() => router.push(`/dashboard/dropai/library?domain=${supplier.domain}&name=${encodeURIComponent(supplier.name)}&source=${encodeURIComponent(supplier.source)}&type=${supplier.type}&image=${encodeURIComponent(supplier.image || '')}`)}
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive/50 hover:text-destructive hover:bg-destructive/5"
                      onClick={() => handleRemoveSupplier(supplier.domain)}
                    >
                      <AlertCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-32 text-center space-y-4 opacity-50 bg-muted/20 rounded-3xl border-2 border-dashed border-primary/10 transition-all">
            <ShoppingBag className="w-16 h-16 text-primary" />
            <div>
              <h2 className="text-xl font-bold">No {filter === 'all' ? '' : filter + 's'} found</h2>
              <p className="max-w-xs text-sm text-muted-foreground mt-1">Start by clicking "Save Marketplace" in Step 2 or 3 of the discovery flow.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Individual Supplier Profile View
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/dropai/library')} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Library Index
        </Button>
        <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 font-bold uppercase text-[10px] tracking-widest">Active Profile</Badge>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 rounded-3xl bg-primary/5 flex items-center justify-center border-2 border-primary/10 shadow-inner shrink-0 overflow-hidden">
           {image ? <img src={image} className="w-full h-full object-cover" /> : <Globe className="w-12 h-12 text-primary" />}
        </div>
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">{name}</h1>
            <p className="text-muted-foreground text-lg flex items-center justify-center md:justify-start gap-2 mt-1">
              <ExternalLink className="w-4 h-4" /> {domain}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-muted/50 px-4 py-2 rounded-xl border border-primary/5">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter italic">Primary Platform</p>
              <p className="font-bold text-sm text-primary">{source || 'Multipass'}</p>
            </div>
            <div className="bg-muted/50 px-4 py-2 rounded-xl border border-primary/5">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter italic">Tracking Since</p>
              <p className="font-bold text-sm text-primary">Today</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center md:justify-start">
             <Button className="font-bold px-8 shadow-lg shadow-primary/20" asChild>
                <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer">Visit Official Store</a>
             </Button>
             <Button 
                variant="outline" 
                className="font-bold border-primary/20 hover:bg-primary/5"
                onClick={() => fetchProducts(domain)}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Package className="w-4 h-4 mr-2" />}
                {loading ? "Scanning..." : "Sync Latest Listings"}
             </Button>
          </div>
        </div>
      </div>

      {/* Conditional Content: Listings */}
      {products.length > 0 && (
        <div className="pt-8 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            Scanned Products ({products.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, idx) => (
              <Card key={idx} className="overflow-hidden border-primary/5 hover:border-primary/20 transition-all">
                <div className="aspect-square bg-muted">
                  <img src={p.thumbnail} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm line-clamp-2 min-h-[40px]">{p.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-extrabold">{p.price}</span>
                    <a href={p.link} target="_blank" className="text-muted-foreground hover:text-primary"><ExternalLink className="w-4 h-4" /></a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="p-12 text-center opacity-40">
           <AlertCircle className="w-12 h-12 mx-auto mb-2" />
           <p className="font-medium">{error}</p>
           <p className="text-[10px] uppercase mt-1 tracking-widest">Privacy Guard Active</p>
        </div>
      )}
    </div>
  );
}

export default function SuppliersLibraryPage() {
  return (
    <div className="container mx-auto max-w-7xl pt-12 pb-24">
      <Suspense fallback={<div className="h-[60vh] flex items-center justify-center p-20 animate-pulse text-primary font-bold tracking-widest uppercase">Initializing Library Engine...</div>}>
        <LibraryContent />
      </Suspense>
    </div>
  );
}

