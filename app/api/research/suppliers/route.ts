import { NextRequest, NextResponse } from 'next/server';
import { getGoogleLens, getGoogleShoppingWholesale, getGoogleWholesaleOrganic } from '@/lib/serpapi';

function extractPrice(item: any): number | null {
  // 1. Explicit SerpApi fields
  if (typeof item.extracted_price === 'number') return item.extracted_price;
  if (item.price?.extracted_value) return item.price.extracted_value;
  
  const priceValue = item.price?.value || item.price;
  if (typeof priceValue === 'number' && priceValue > 0) return priceValue;
  
  if (priceValue && typeof priceValue === 'string') {
     const val = parseFloat(priceValue.replace(/[^0-9.]/g, ''));
     if (!isNaN(val) && val > 0) return val;
  }
  
  // 2. Rich Snippets (Found in organic results)
  const richPrice = item.rich_snippet?.top?.detected_extensions?.price || 
                    item.rich_snippet?.top?.detected_extensions?.cost ||
                    item.rich_snippet?.bottom?.detected_extensions?.price;
  if (richPrice) {
    const val = parseFloat(String(richPrice).replace(/[^0-9.]/g, ''));
    if (!isNaN(val) && val > 0) return val;
  }

  // 3. Snippet parsing (Regex fallback for organic/lens snippets)
  const textToScan = [item.snippet, item.title].filter(Boolean).join(' ');
  // Look for patterns like "$12.99", "USD 12.99", "€12.99", "$12 - $15", "US $12.99"
  // Regex handles "$12.99", "USD 12.99", "12.99 USD", "12.99$", "€12.99", "12,99 €"
  const priceRegex = /(?:(?:\$|USD|EUR|€|US\s*\$|£)\s*(\d+(?:[.,]\d{2})?))|(?:(\d+(?:[.,]\d{2})?)\s*(?:\$|USD|EUR|€|US\s*\$|£))/gi;
  const matches = [...textToScan.matchAll(priceRegex)];
  if (matches.length > 0) {
    const prices = matches.map(m => parseFloat((m[1] || m[2]).replace(',', '.'))).filter(p => p > 0);
    if (prices.length > 0) return Math.min(...prices);
  }
  
  // 4. Raw string fallback
  const priceStr = item.price || item.extracted_price;
  if (typeof priceStr === 'string' && priceStr.length < 30) {
    const cleaned = priceStr.split('-')[0].replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const keyword = req.nextUrl.searchParams.get('q');
    const imageUrl = req.nextUrl.searchParams.get('url');
    
    if (!keyword && !imageUrl) {
      return NextResponse.json({ error: 'Must provide either "q" or "url" parameter.' }, { status: 400 });
    }

    // 1. Concurrent Fetching
    const [lensData, shoppingWholesaleData, organicWholesaleData] = await Promise.all([
      imageUrl ? getGoogleLens(imageUrl) : Promise.resolve({ visual_matches: [] }),
      keyword ? getGoogleShoppingWholesale(keyword) : Promise.resolve({ shopping_results: [] }),
      keyword ? getGoogleWholesaleOrganic(keyword) : Promise.resolve({ organic_results: [] })
    ]);

    // 2. Extract potential keyword from Lens if we don't have one
    let derivedKeyword = keyword;
    if (!derivedKeyword && lensData.visual_matches?.length > 0) {
      derivedKeyword = lensData.visual_matches[0].title;
    }

    // 3. If we derived a keyword from Lens, and didn't have organic data yet, try to fetch it
    let finalOrganicData = organicWholesaleData;
    if (!keyword && derivedKeyword && (!finalOrganicData.organic_results || finalOrganicData.organic_results.length === 0)) {
       try {
         finalOrganicData = await getGoogleWholesaleOrganic(derivedKeyword);
       } catch (e) {}
    }

    const lensMatches = (lensData.visual_matches || []).map((m: any) => ({ ...m, source_type: 'visual_match' }));
    const shoppingMatches = (shoppingWholesaleData.shopping_results || []).map((m: any) => ({ ...m, source_type: 'shopping_wholesale' }));
    const organicMatches = (finalOrganicData.organic_results || []).map((m: any) => ({ ...m, source_type: 'organic_wholesale' }));

    let allSuppliers = [...lensMatches, ...shoppingMatches, ...organicMatches];

    const verifiedPlatforms = [
      'aliexpress', 'alibaba', 'cjdropshipping', 'spocket', 'salehoo', 
      'zendrop', 'wholesale2b', 'modalyst', 'doba', 'worldwidebrands', 
      'dhgate', 'banggood', '1688', 'made-in-china', 'globalsources'
    ];
    const retailPlatforms = [
      'amazon', 'walmart', 'ebay', 'target', 'bestbuy', 'etsy', 'myshopify', 'shopify', '.shop', '.store',
      'bedbathandbeyond', 'offerup', 'woot', 'mercari', 'poshmark', 'facebook', 'pinterest', 'temu', 'shein'
    ];

    const processedSuppliers = allSuppliers
      .map((s: any) => {
        const url = (s.link || s.product_link || '').toLowerCase();
        const sourceName = (s.source || s.displayed_link || '').toLowerCase();
        const textToSearch = `${url} ${sourceName}`;
        
        const isVerified = verifiedPlatforms.some(p => textToSearch.includes(p));
        const isRetail = retailPlatforms.some(p => textToSearch.includes(p));
        const price = extractPrice(s);

        const inlineImages = s.inline_images || [];
        const primaryImage = inlineImages[0]?.thumbnail || s.image || s.thumbnail || s.favicon || s.rich_snippet?.top?.detected_extensions?.image_url;

        const source = s.source || (isVerified ? 'Wholesale Factory' : (isRetail ? 'Retailer' : 'Marketplace'));
        const cleanSource = source.replace(/https?:\/\//, '').split('/')[0].split('?')[0];

        return {
          ...s,
          link: s.link || s.product_link,
          title: s.title || s.snippet || 'Wholesale Product',
          extracted_price: price,
          is_verified: isVerified,
          is_retail: isRetail,
          thumbnail: primaryImage,
          source: cleanSource
        };
      })
      .filter((s: any) => s.link && s.title && !s.is_retail);

    const uniqueMap = new Map();
    processedSuppliers.forEach(s => {
      const cleanUrl = s.link.split('?')[0].replace('www.', '');
      if (!uniqueMap.has(cleanUrl) || (!uniqueMap.get(cleanUrl).extracted_price && s.extracted_price)) {
        uniqueMap.set(cleanUrl, s);
      }
    });

    const finalSuppliers = Array.from(uniqueMap.values());

    finalSuppliers.sort((a, b) => {
      const hasPriceA = !!a.extracted_price;
      const hasPriceB = !!b.extracted_price;
      if (hasPriceA && !hasPriceB) return -1;
      if (!hasPriceA && hasPriceB) return 1;

      if (a.is_verified && !b.is_verified) return -1;
      if (!a.is_verified && b.is_verified) return 1;
      
      if (a.is_retail && !b.is_retail) return 1;
      if (!a.is_retail && b.is_retail) return -1;
      
      const priceA = a.extracted_price || 999999;
      const priceB = b.extracted_price || 999999;
      return priceA - priceB;
    });

    const lowestPrice = finalSuppliers.find(s => s.extracted_price && s.extracted_price > 0)?.extracted_price || 0;

    return NextResponse.json({
      method: 'wholesale_intelligence_v4',
      lowestPrice,
      suppliersCount: finalSuppliers.length,
      suppliers: finalSuppliers,
      // Debug info
      stats: {
        total_discovered: allSuppliers.length,
        total_processed: processedSuppliers.length,
        total_unique: finalSuppliers.length
      },
      raw_lens: lensData,
      raw_shopping: shoppingWholesaleData,
      raw_organic: organicWholesaleData
    });
    
  } catch (error: any) {
    console.error('Error in suppliers route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supplier data', details: error.message },
      { status: 500 }
    );
  }
}

