import { NextRequest, NextResponse } from 'next/server';
import { getGoogleShopping, getGoogleSearchShopify } from '@/lib/serpapi';

export async function GET(req: NextRequest) {
  try {
    const keyword = req.nextUrl.searchParams.get('q');
    
    if (!keyword) {
      return NextResponse.json({ error: 'Missing keyword parameter "q"' }, { status: 400 });
    }

    // Run both queries in parallel to save execution time
    const [shoppingData, organicData] = await Promise.all([
      getGoogleShopping(keyword),
      getGoogleSearchShopify(keyword)
    ]);

    // Process Google Shopping (Paid Landscape)
    const shoppingResults = shoppingData.shopping_results || [];
    
    // Process Google Search (Organic Shopify Spying)
    const organicResults = organicData.organic_results || [];

    // Calculate Average Market Price from Shopping Results
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
      shopifyStores: organicResults,
      raw_shopping: shoppingData,
      raw_organic: organicData
    });
    
  } catch (error: any) {
    console.error('Error in competitive route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitive data', details: error.message },
      { status: 500 }
    );
  }
}
