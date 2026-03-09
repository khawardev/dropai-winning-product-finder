import { NextRequest, NextResponse } from 'next/server';
import { getGoogleLens, getGoogleShoppingAliExpress } from '@/lib/serpapi';

export async function GET(req: NextRequest) {
  try {
    const keyword = req.nextUrl.searchParams.get('q');
    const imageUrl = req.nextUrl.searchParams.get('url');
    
    if (!keyword && !imageUrl) {
      return NextResponse.json({ error: 'Must provide either "q" or "url" parameter.' }, { status: 400 });
    }

    let rawData: any;
    let suppliers: any[] = [];
    let methodUsed = '';

    // Primary method: Google Lens with image URL
    if (imageUrl) {
      methodUsed = 'google_lens';
      rawData = await getGoogleLens(imageUrl);
      
      // Extract exact visual matches
      const visualMatches = rawData.visual_matches || [];
      suppliers = visualMatches;
    } 
    // Secondary method: Google Shopping keyword with AliExpress appended
    else if (keyword) {
      methodUsed = 'google_shopping_alibaba_aliexpress';
      rawData = await getGoogleShoppingAliExpress(keyword);
      
      const shoppingResults = rawData.shopping_results || [];
      suppliers = shoppingResults;
    }

    // Attempt to extract the lowest wholesale price from the suppliers
    let lowestPrice = Infinity;
    suppliers.forEach(s => {
      // Clean price logic
      let priceVal = methodUsed === 'google_lens' 
        ? (s.price ? s.price.extracted_value : null) 
        : s.extracted_price;

      if (!priceVal && s.price) {
        if (typeof s.price === 'string') {
          const parsed = parseFloat(s.price.replace(/[^0-9.]/g, ''));
          if (!isNaN(parsed)) {
            priceVal = parsed;
          }
        }
      }
      
      if (typeof priceVal === 'number' && priceVal < lowestPrice && priceVal > 0) {
        lowestPrice = priceVal;
      }
    });

    if (lowestPrice === Infinity) {
      lowestPrice = 0;
    }

    return NextResponse.json({
      method: methodUsed,
      lowestPrice,
      suppliersCount: suppliers.length,
      suppliers,
      raw_data: rawData
    });
    
  } catch (error: any) {
    console.error('Error in suppliers route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supplier data', details: error.message },
      { status: 500 }
    );
  }
}
