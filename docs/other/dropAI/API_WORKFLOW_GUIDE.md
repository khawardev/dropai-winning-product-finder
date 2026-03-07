
# DropAI API & Workflow Guide
## *SerpApi-Powered Market Intelligence System*

---

## 🎯 System Overview

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Source of Truth** | **SerpApi** | Unified data layer for all market intelligence |
| **AI Brain** | Google Gemini 2.0 Flash | Data synthesis, gap analysis, opportunity scoring |
| **Cache Layer** | Supabase PostgreSQL | 24h smart caching for cost optimization |
| **UI Layer** | Next.js 14 + Tailwind | Real-time dashboard with agent progress |

---

## Agent 1: Market Scout (Trend Identification)

| | Details |
|---|---|
| **Source of Truth** | **SerpApi Google Trends API** |
| **Endpoint** | `https://serpapi.com/search?engine=google_trends` |
| **Process** | 1. Query niche keyword (e.g., "dog accessories")<br>2. Extract `interest_over_time` data<br>3. Identify `related_queries` (rising)<br>4. Filter by `geo` (target country)<br>5. Gemini validates trend velocity |
| **Goal** | Identify **3-5 trending products** with rising search interest in the target market |
| **Cache Check** | Query Supabase: `SELECT * FROM trends WHERE niche=$1 AND country=$2 AND created_at > NOW() - INTERVAL '24 hours'` |

**SerpApi Parameters Used:**
- `engine=google_trends`
- `q=niche_keyword` (e.g., "portable dog water bottle")
- `data_type=RELATED_QUERIES` (find rising searches)
- `geo=US` (target country)
- `date=today 3-m` (recent trend validation) 

---

## Agent 2: Sourcing Specialist (Wholesale Discovery)

| | Details |
|---|---|
| **Source of Truth** | **SerpApi Google Shopping API** + **SerpApi Google Search API** |
| **Endpoint** | `https://serpapi.com/search?engine=google_shopping` + `https://serpapi.com/search?engine=google` |
| **Process** | 1. **Google Shopping**: Search product with `tbs=mr:1` (merchant filter) to find B2B listings<br>2. **Google Search**: Use `site:aliexpress.com OR site:alibaba.com` operator<br>3. Extract: price, MOQ, shipping estimates, seller ratings<br>4. Gemini ranks suppliers by reliability score |
| **Goal** | Find **3-5 wholesale suppliers** with pricing, MOQ, and shipping data |

**SerpApi Parameters Used:**
- **Google Shopping**: `engine=google_shopping`, `q=product_name`, `gl=US`, `hl=en` 
- **Google Search**: `engine=google`, `q=product_name site:aliexpress.com`, `num=20`

---

## Agent 3: Logistics Auditor (Supplier Evaluation)

| | Details |
|---|---|
| **Source of Truth** | **SerpApi Google Shopping Product API** |
| **Endpoint** | `https://serpapi.com/search?engine=google_product` |
| **Process** | 1. Query specific product IDs from Agent 2<br>2. Extract detailed specs: `pricing`, `shipping_costs`, `delivery_time`, `seller_ratings`, `return_policy`<br>3. Cross-reference seller history via `seller_reviews`<br>4. Gemini calculates reliability score |
| **Goal** | Validate supplier viability: **pricing tiers, shipping reliability, quality indicators** |

**SerpApi Parameters Used:**
- `engine=google_product`
- `product_id` (from shopping results)
- `offers=1` (pricing details)
- `reviews=1` (seller reputation) 

---

## Agent 4: Intelligence Officer (Competitive Landscape)

| | Details |
|---|---|
| **Source of Truth** | **SerpApi Google Shopping API** + **SerpApi eBay API** + **SerpApi Walmart API** |
| **Endpoint** | `engine=google_shopping`, `engine=ebay`, `engine=walmart` |
| **Process** | 1. **Google Shopping**: Find Shopify/retail sellers (filter by `seller` names)<br>2. **eBay API**: Scrape competitor listings for price anchoring<br>3. **Walmart API**: Big-box retail pricing benchmark<br>4. Aggregate all retail listings |
| **Goal** | Map **competitive retail landscape**: who's selling, at what price, with what shipping** |

**SerpApi Parameters Used:**
- **eBay**: `engine=ebay`, `ebay_domain=ebay.com`, `_nkw=product_name` 
- **Walmart**: `engine=walmart`, `query=product_name` 
- **Google Shopping**: `engine=google_shopping`, `tbs=vw:g` (view grid for more results)

---

## Agent 5: Performance Analyst (Competitor Benchmarking)

| | Details |
|---|---|
| **Source of Truth** | **SerpApi Google Search API** + **SerpApi Google Shopping API** |
| **Endpoint** | `engine=google`, `engine=google_shopping` |
| **Process** | 1. **Google Search**: `intitle:"product name" site:myshopify.com` to find Shopify stores<br>2. **Google Shopping**: Extract `price`, `shipping`, `rating`, `review_count`<br>3. Analyze: price distribution, shipping speed claims, review quality<br>4. Identify gaps: underserved price points, slow shipping competitors |
| **Goal** | **Benchmark competitor performance** and identify market weaknesses |

**SerpApi Parameters Used:**
- `engine=google`, `q=intitle:"portable dog water bottle" site:myshopify.com`
- `engine=google_shopping`, `q=product_name`, `tbm=shop`

---

## Agent 6: Financial Architect (Gap & Profitability Analysis)

| | Details |
|---|---|
| **Source of Truth** | **Aggregated SerpApi Data** + **Gemini 2.0 Flash** |
| **Process** | 1. **Input**: Wholesale data (Agent 3) + Retail data (Agent 5)<br>2. **Calculate**:<br>   - `Gross Margin = Retail Price - Wholesale Cost`<br>   - `Net Margin = Gross Margin - Shipping - Ad Spend (est. 30%)`<br>   - `Market Gap Score = f(Competition Density, Price Spread, Review Quality)`<br>3. **Gemini Synthesizes**:<br>   - Opportunity rating (High/Medium/Low)<br>   - Launch strategy recommendations<br>   - Risk factors |
| **Goal** | **Final verdict**: Profitability score, market gap analysis, go/no-go recommendation |

---
