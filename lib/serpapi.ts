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
export async function getGoogleTrends(keyword: string) {
  return fetchSerpApi({
    engine: 'google_trends',
    q: keyword,
    data_type: 'RELATED_QUERIES',
    date: 'today 3-m'
  });
}

/**
 * Step 2: Google Shopping
 */
export async function getGoogleShopping(keyword: string) {
  return fetchSerpApi({
    engine: 'google_shopping',
    q: keyword
  });
}

/**
 * Step 3: Google Search (Organic Shopify Spy)
 */
export async function getGoogleSearchShopify(keyword: string) {
  return fetchSerpApi({
    engine: 'google',
    q: `intitle:"${keyword}" site:myshopify.com`
  });
}

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
 * Step 4 (Fallback): Google Shopping with AliExpress filter
 */
export async function getGoogleShoppingAliExpress(keyword: string) {
  return fetchSerpApi({
    engine: 'google_shopping',
    q: `${keyword} AliExpress`
  });
}
