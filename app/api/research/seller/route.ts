import { NextRequest, NextResponse } from 'next/server';
import { getGoogleSellerProducts } from '@/lib/serpapi';

export async function GET(req: NextRequest) {
  try {
    const domain = req.nextUrl.searchParams.get('domain');
    const keyword = req.nextUrl.searchParams.get('q');
    
    if (!domain) {
      return NextResponse.json({ error: 'Missing domain parameter' }, { status: 400 });
    }

    const data = await getGoogleSellerProducts(domain, keyword || undefined);

    return NextResponse.json({
      domain,
      results: data.shopping_results || [],
      metadata: data.search_metadata || {},
      raw: data
    });
    
  } catch (error: any) {
    console.error('Error in seller products route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seller products', details: error.message },
      { status: 500 }
    );
  }
}
