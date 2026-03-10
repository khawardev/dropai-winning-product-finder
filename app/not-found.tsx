'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 animate-bounce">
        <Zap className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-6">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-10">
        The page you are looking for doesn&apos;t exist or has been moved. 
        Let&apos;s get you back on track to finding winning products.
      </p>
      <Link href="/dashboard">
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
