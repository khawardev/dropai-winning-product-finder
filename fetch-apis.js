require('dotenv').config();
const fs = require('fs');
const path = require('path');

const SERP_API_KEY = process.env.SERP_API_KEY;
const APIFY_TOKEN = process.env.APIFY_TOKEN;
const OUT_DIR = path.join(__dirname, 'docs', 'Apis', 'responses');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function fetchSerpApi(params, filename) {
  try {
    const url = new URL('https://serpapi.com/search.json');
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    url.searchParams.append('api_key', SERP_API_KEY);
    
    console.log(`Fetching ${filename}...`);
    const res = await fetch(url.toString());
    const data = await res.json();
    fs.writeFileSync(path.join(OUT_DIR, filename), JSON.stringify(data, null, 2));
    console.log(`Saved ${filename}`);
    return data;
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
  }
}

async function fetchApify(actorId, input, filename) {
  try {
    console.log(`Starting Apify actor ${actorId}...`);
    const runRes = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    const runData = await runRes.json();
    if (!runData.data) {
      console.error('Apify API Error:', runData);
      return;
    }
    const runId = runData.data.id;
    
    console.log(`Waiting for Apify run ${runId} to finish...`);
    let status = 'RUNNING';
    while (status !== 'SUCCEEDED' && status !== 'FAILED') {
      await new Promise(resolve => setTimeout(resolve, 5000));
      const statusRes = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs/${runId}?token=${APIFY_TOKEN}`);
      const statusData = await statusRes.json();
      status = statusData.data.status;
      console.log(`Status: ${status}`);
    }
    
    if (status === 'SUCCEEDED') {
      const datasetId = runData.data.defaultDatasetId;
      console.log(`Fetching dataset ${datasetId}...`);
      const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`);
      const datasetData = await datasetRes.json();
      fs.writeFileSync(path.join(OUT_DIR, filename), JSON.stringify(datasetData, null, 2));
      console.log(`Saved ${filename}`);
    }
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
  }
}

async function run() {
  const query = 'gaming chair';
  
  // 1. Google Trends (Agent 1)
  await fetchSerpApi({
    engine: 'google_trends',
    q: query,
    data_type: 'RELATED_QUERIES',
    geo: 'US',
    date: 'today 3-m'
  }, 'serpapi-trends.json');

  // 2. Google Shopping (Agent 2)
  const shoppingData = await fetchSerpApi({
    engine: 'google_shopping',
    q: query,
    gl: 'us',
    hl: 'en'
  }, 'serpapi-shopping.json');

  // 3. Google Product (Agent 3) - Find a product ID if available
  if (shoppingData && shoppingData.shopping_results && shoppingData.shopping_results.length > 0) {
    const productId = shoppingData.shopping_results[0].product_id;
    if (productId) {
      await fetchSerpApi({
        engine: 'google_product',
        product_id: productId,
        offers: '1',
        reviews: '1',
        gl: 'us',
        hl: 'en'
      }, 'serpapi-product.json');
    }
  }

  // 4. Google Search for Shopify Stores (Agent 5)
  await fetchSerpApi({
    engine: 'google',
    q: `intitle:"${query}" site:myshopify.com`
  }, 'serpapi-google-search.json');

  // Apify TikTok Scraper
  await fetchApify('clockworks~tiktok-hashtag-scraper', {
    hashtags: [query.replace(' ', '')],
    resultsPerPage: 5,
    shouldDownloadCovers: false,
    shouldDownloadVideos: false
  }, 'apify-tiktok.json');

  // Apify Shopify Scraper (for one of the results)
  // Assuming using a generic shopify scraper actor
  await fetchApify('clearpath~shop-by-shopify-product-scraper', {
    query: query,
    maxItems: 5
  }, 'apify-shopify-retry.json');
}

run();
