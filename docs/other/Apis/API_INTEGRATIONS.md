# DropAI API Integrations Guide

This document provides an overview of the external APIs integrated into the DropAI winning product finder, explains their purpose within the agentic workflow, and provides links for manual verification.

---

## 🚀 Primary APIs (Active)

These APIs are currently being utilized by the Mastra AI agents to fetch real-world data.

### 1. SerpApi (Google Trends Engine)
- **Purpose**: Used by the **TrendSpotter Agent** to validate market demand.
- **Why**: It provides accurate "Interest Over Time" and "Related Queries" data directly from Google Trends. This prevents the AI from suggesting "dead" niches and ensures products have actual rising search volume.
- **Manual Verification**: [SerpApi Google Trends Documentation](https://serpapi.com/google-trends-api)
- **Key Logic**: Searches for rising slopes in keyword interest over the last 3 months.

### 2. SerpApi (Google Shopping Engine)
- **Purpose**: Used by **SupplierHunter** and **ProfitAnalyst** agents.
- **Why**: This is the "source of truth" for the entire app. It allows the agents to:
    - Find live AliExpress listings (via `site:aliexpress.com` queries).
    - Extract real MSRP (retail prices) from competitors.
    - Fetch high-quality product **thumbnails/images**.
    - Identify verified sellers and shipping costs.
- **Manual Verification**: [SerpApi Google Shopping Documentation](https://serpapi.com/google-shopping-api)

### 3. Apify (TikTok Hashtag Scraper)
- **Purpose**: Used by the **TrendSpotter Agent** for social proof.
- **Why**: It scrapes real-time view counts, play counts, and engagement metrics for hashtags like `#amazonfinds` or niche-specific tags. This ensures the products are "viral" and not just "searched for."
- **Manual Verification**: [Apify TikTok Scraper Actor](https://apify.com/clockworks/tiktok-hashtag-scraper)

### 4. Google Gemini (LLM)
- **Purpose**: The "brain" behind the agents.
- **Model**: `gemini-2.0-flash`
- **Why**: Chosen for its high speed, low cost, and extremely large context window, which is necessary for processing the large JSON outputs returned by the scraping tools.
- **Manual Verification**: [Google AI Studio](https://aistudio.google.com/)

---

## ⚠️ Legacy / Alternative Tools

These tools exist in the codebase (`mastra/tools/`) but are currently deactivated in the agent instructions due to reliability or configuration issues.

### 1. Apify AliExpress Scraper (`cloud9_ai~aliexpress-scraper`)
- **Status**: **Inactive**. 
- **Issue**: Highly sensitive to payload changes and frequently returns 400 errors if the specific actor version is updated or if proxy settings aren't perfect.
- **Replacement**: The `SerpApi Google Shopping` tool is currently used with a `site:aliexpress.com` filter as it is 100% reliable and returns the same data (price, image, link).

### 2. Apify Shopify Scraper (`dhrumil~shopify-products-scraper`)
- **Status**: **Inactive**.
- **Issue**: Requires specific Store URLs and often fails if the store has bot protection enabled.
- **Replacement**: `SerpApi Google Shopping` identifies competitors and their prices more broadly across the web without being blocked by individual Shopify store firewalls.

---

## 🛠 How to Test Manually

If you want to verify if a product is "Winning" manually using these same sources:

1. **Check Demand**: Go to [Google Trends](https://trends.google.com/) and type your niche. Look for a "rising" graph.
2. **Check Viral Signal**: Search TikTok for `#{yourniche}products`. Look for videos with >1M views posted in the last 30 days.
3. **Check Supplier Price**: Search Google Shopping for the product. Note the average retail price.
4. **Find Source**: Search Google Shopping with `site:aliexpress.com {product name}` to find the base manufacturer cost.

**Profit Calculation Formula used by agents:**
`Net Profit = (Average MSRP) - (AliExpress Cost) - (Estimated Shipping) - (Estimated Ad Spend ~$5.00)`
