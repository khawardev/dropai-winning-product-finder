import { NextRequest, NextResponse } from 'next/server';
import { getAmazonSearch, getEbaySearch, getWalmartSearch } from '@/lib/serpapi';

export async function GET(req: NextRequest) {
  try {
    const keyword = req.nextUrl.searchParams.get('q');
    
    if (!keyword) {
      return NextResponse.json({ error: 'Missing keyword parameter' }, { status: 400 });
    }

    // Call all marketplace engines in parallel
    const [amazon, ebay, walmart] = await Promise.allSettled([
      getAmazonSearch(keyword),
      getEbaySearch(keyword),
      getWalmartSearch(keyword)
    ]);

    const results: any = {
      amazon: amazon.status === 'fulfilled' ? (amazon.value.shopping_results || []) : [],
      ebay: ebay.status === 'fulfilled' ? (ebay.value.organic_results || []) : [],
      walmart: walmart.status === 'fulfilled' ? (walmart.value.organic_results || []) : []
    };

    return NextResponse.json(results);
    
  } catch (error: any) {
    console.error('Error in marketplaces discovery route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace data', details: error.message },
      { status: 500 }
    );
  }
}
