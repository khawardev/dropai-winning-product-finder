import { NextRequest, NextResponse } from 'next/server';
// Cache Invalidated: 2026-03-09 17:05
import { getGoogleShopping, getGoogleMarketplaceOrganic, getGoogleMarketIntelligence } from '@/lib/serpapi';

export async function GET(req: NextRequest) {
  try {
    const keyword = req.nextUrl.searchParams.get('q');
    
    if (!keyword) {
      return NextResponse.json({ error: 'Missing keyword parameter "q"' }, { status: 400 });
    }

    const [shoppingData, organicData, marketData] = await Promise.all([
      getGoogleShopping(keyword),
      getGoogleMarketplaceOrganic(keyword),
      getGoogleMarketIntelligence(keyword)
    ]);

    const shoppingResults = shoppingData.shopping_results || [];
    const organicResults = organicData.organic_results || [];

    let avgPrice = 0;
    let validPrices = 0;
    
    shoppingResults.forEach((r: any) => {
      if (r.extracted_price) {
        avgPrice += r.extracted_price;
        validPrices++;
      }
    });

    if (validPrices > 0) {
      avgPrice = avgPrice / validPrices;
    }

    return NextResponse.json({
      original_keyword: keyword,
      avgPrice,
      competitors: shoppingResults,
      marketplaceStores: organicResults,
      shopifyStores: organicResults,
      marketIntelligence: {
        relatedBrands: marketData.related_brands || [],
        productSites: marketData.product_sites || [],
        localResults: marketData.local_results || null,
        knowledgeGraph: marketData.knowledge_graph || null,
        ads: marketData.ads || []
      },
      raw_shopping: shoppingData,
      raw_organic: organicData,
      raw_market: marketData
    });
    
  } catch (error: any) {
    console.error('Error in competitive route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitive data', details: error.message },
      { status: 500 }
    );
  }
}
