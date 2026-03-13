export const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';

export async function fetchSerpApi(params: Record<string, string>) {
  const apiKey = process.env.SERP_API_KEY;
  
  if (!apiKey) {
    throw new Error('SERP_API_KEY is not defined in environment variables.');
  }

  const url = new URL(SERPAPI_BASE_URL);
  
  // Add common parameters
  url.searchParams.append('api_key', apiKey);
  
  // Add specific parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      // Cache settings for Next.js - 24 hours (86400 seconds)
      next: { revalidate: 86400 } 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `SerpAPI returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('SerpAPI Error:', error);
    throw error;
  }
}

/**
 * Step 1: Google Trends
 */
export async function getGoogleTrends(keyword: string, geo = 'US', date = 'today 3-m') {
  return fetchSerpApi({
    engine: 'google_trends',
    q: keyword,
    data_type: 'RELATED_QUERIES',
    date: date,
    geo: geo
  });
}

/**
 * Step 2: Google Shopping
 */
export async function getGoogleShopping(keyword: string) {
  const marketplaces = [
    'Amazon', 'eBay', 'Walmart', 'Etsy', 'Shopify', 'BigCommerce', 
    'Target', '"Facebook Marketplace"', 'Depop', 'Whatnot'
  ].join(' OR ');

  return fetchSerpApi({
    engine: 'google_shopping',
    q: `${keyword} (${marketplaces})`,
    direct_link: 'true'
  });
}

/**
 * Step 3: Google Search (Organic Marketplace Spy)
 */
export async function getGoogleMarketplaceOrganic(keyword: string) {
  const sites = [
    'myshopify.com', 'ebay.com', 'amazon.com', 'walmart.com', 'etsy.com', 
    'bigcommerce.com', 'target.com/plus', 'facebook.com/marketplace', 'depop.com', 'whatnot.com'
  ].map(site => `site:${site}`).join(' OR ');

  return fetchSerpApi({
    engine: 'google',
    q: `intitle:"${keyword}" (${sites})`,
    num: '20'
  });
}

/**
 * Backward compatibility
 */
export const getGoogleSearchShopify = getGoogleMarketplaceOrganic;

/**
 * Step 4: Google Lens (Image reverse search)
 */
export async function getGoogleLens(imageUrl: string) {
  return fetchSerpApi({
    engine: 'google_lens',
    url: imageUrl
  });
}

/**
 * Step 5: Google Shopping with Platform filter
 */
export async function getGoogleShoppingWholesale(keyword: string) {
  const platforms = [
    'AliExpress', 'Alibaba', '"CJ Dropshipping"', 'Spocket', 'SaleHoo', 
    'Zendrop', 'Wholesale2B', 'Modalyst', 'Doba', '"Worldwide Brands"', 
    'DHgate', 'Banggood', '1688'
  ].join(' OR ');
  
  return fetchSerpApi({
    engine: 'google_shopping',
    q: `${keyword} (${platforms})`,
    direct_link: 'true'
  });
}

/**
 * Step 6: Market Intelligence (Related Brands & Product Sites)
 */
export async function getGoogleMarketIntelligence(keyword: string) {
  return fetchSerpApi({
    engine: 'google',
    q: keyword,
    gl: 'us',
    hl: 'en'
  });
}

/**
 * Step 7: Wholesale Market Spying (Direct site search)
 */
export async function getGoogleWholesaleOrganic(keyword: string) {
  const sites = [
    'aliexpress.com', 'alibaba.com', 'cjdropshipping.com', 'spocket.co',
    'salehoo.com', 'zendrop.com', 'wholesale2b.com', 'modalyst.co',
    'doba.com', 'worldwidebrands.com', 'dhgate.com', 'banggood.com', '1688.com'
  ].map(site => `site:${site}`).join(' OR ');

  return fetchSerpApi({
    engine: 'google',
    q: `${keyword} ("wholesale price" OR "dropshipping price" OR "bulk") (${sites})`,
    num: '20'
  });
}

/**
 * Step 8: Seller Product Discovery
 * Finds more products from a specific seller's domain.
 */
export async function getGoogleSellerProducts(domain: string, keyword?: string) {
  const query = keyword ? `site:${domain} ${keyword}` : `site:${domain}`;
  
  return fetchSerpApi({
    engine: 'google_shopping',
    q: query,
    direct_link: 'true'
  });
}

/**
 * Step 9: Merchant Details (if Merchant ID is available)
 */
export async function getGoogleMerchantDetails(merchantId: string) {
  return fetchSerpApi({
    engine: 'google_shopping_merchant',
    merchant_id: merchantId
  });
}

/**
 * Step 10: Direct Marketplace Search (Amazon, eBay, Walmart)
 * Use platform-specific engines for more accurate discovery.
 */
export async function getAmazonSearch(keyword: string) {
  return fetchSerpApi({
    engine: 'amazon',
    q: keyword,
    amazon_domain: 'amazon.com',
    type: 'search'
  });
}

export async function getEbaySearch(keyword: string) {
  return fetchSerpApi({
    engine: 'ebay',
    _nkw: keyword
  });
}

export async function getWalmartSearch(keyword: string) {
  return fetchSerpApi({
    engine: 'walmart',
    query: keyword
  });
}
