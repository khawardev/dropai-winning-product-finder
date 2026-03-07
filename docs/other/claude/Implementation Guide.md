# 🗺️ Complete Implementation Guide
## Dropshipping Research Platform — Next.js + Supabase + RapidAPI

---

## PHASE 1 — Project Foundation

### 1.1 Initialize Project
- Create new Next.js project with App Router and TypeScript
- Enable Turbopack for faster dev builds
- Set ESLint and Prettier configs
- Set up path aliases (`@/server`, `@/lib`, `@/components`)
- Install core dependencies: Drizzle ORM, Supabase client, Vercel AI SDK, SWR, Zod

### 1.2 Environment Setup
Create `.env.local` with these variable slots:
- `RAPIDAPI_KEY` — single key for all RapidAPI services
- `CJ_API_KEY` — CJ Dropshipping direct API
- `OPENAI_API_KEY` — for Vercel AI SDK
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` — Supabase Postgres direct connection string

### 1.3 Supabase Project Setup
- Create new Supabase project
- Enable Row Level Security (RLS) on all tables
- Create RLS policy: users can only read/write their own data
- Get the direct Postgres connection string for Drizzle
- Enable Supabase Auth (email or OAuth)

### 1.4 Drizzle Setup
- Install `drizzle-orm`, `drizzle-kit`, `pg`
- Create `drizzle.config.ts` pointing to `/server/db/schema`
- Create `/server/db/index.ts` as the single Drizzle client instance
- All schema files live in `/server/db/schema/`
- All migrations live in `/server/db/migrations/`

---

## PHASE 2 — Database Schema & Migrations

### 2.1 Define All Tables in Order

Create one file per table in `/server/db/schema/`:

**`searches.ts`**
Stores the user's original search session. Fields: id, userId, rawQuery, location, minPrice, maxPrice, refinedKeyword, trendData (jsonb), createdAt

**`products.ts`**
One product record per search. Fields: id, searchId (FK), refinedKeyword, trendScore, trendDirection (rising/stable/falling), status (pending/analyzing/analyzed), createdAt

**`wholesale_products.ts`**
Products found on AliExpress and CJ. Fields: id, productId (FK), platform, externalId, title, price, currency, imageUrl, productUrl, specs (jsonb), variants (jsonb), rawData (jsonb), createdAt

**`wholesale_suppliers.ts`**
Supplier behind each wholesale product. Fields: id, productId (FK), wholesaleProductId (FK), platform, storeName, rating, totalOrders, responseRate, shippingTime, country, storeUrl, rawData (jsonb), createdAt

**`competitive_products.ts`**
Products found on Amazon, eBay, Google Shopping. Fields: id, productId (FK), platform, externalId, title, price, currency, imageUrl, productUrl, reviewCount, rating, rawData (jsonb), createdAt

**`competitive_sellers.ts`**
Sellers behind each competitive product. Fields: id, productId (FK), competitiveProductId (FK), platform, sellerName, rating, reviewCount, storeUrl, rawData (jsonb), createdAt

**`product_reports.ts`**
Final analysis output. Fields: id, productId (FK unique), avgWholesalePrice, avgRetailPrice, profitMargin, gapScore, opportunityScore (1-10), competitorCount, supplierCount, aiSummary, aiMarketingStrategy, aiRecommendation (strong-buy/moderate/avoid), rawAnalysis (jsonb), createdAt

**`saved_products.ts`**
User bookmarks. Fields: id, userId, productId (FK), savedAt

### 2.2 Export All Schemas
- Create `/server/db/schema/index.ts` that re-exports everything
- This is what Drizzle kit reads for migration generation

### 2.3 Run Initial Migration
- Run `drizzle-kit generate` to produce SQL migration file
- Run `drizzle-kit migrate` to apply to Supabase
- Verify all tables appear in Supabase dashboard

---

## PHASE 3 — API Services Layer

### 3.1 RapidAPI Base Client
Create `/server/services/rapidapi/client.ts`
- Single function that accepts URL and host
- Injects `X-RapidAPI-Key` and `X-RapidAPI-Host` headers automatically
- Sets `next: { revalidate: 0 }` to prevent caching
- Throws typed errors on non-200 responses
- All other services import and use this client only

### 3.2 Google Trends Service
File: `/server/services/rapidapi/trends.service.ts`
RapidAPI product: **Google Trends API** (`google-trends8.p.rapidapi.com`)

What to implement:
- `getInterestOverTime(keyword, location)` — returns 12-month interest data for charts
- `getRisingQueries(keyword, location)` — returns top rising related searches
- `getTrendDirection(keyword, location)` — returns rising/stable/falling classification

The rising queries endpoint is the most important — the top result becomes your `refinedKeyword`.

### 3.3 AliExpress Service
File: `/server/services/rapidapi/aliexpress.service.ts`
RapidAPI product: **AliExpress Datahub API** (`aliexpress-datahub.p.rapidapi.com`)

What to implement:
- `searchProducts(keyword, location, minPrice, maxPrice)` — returns product listings
- `getProductDetail(itemId)` — full product specs and variants
- `getProductSupplier(itemId)` — supplier info for a specific product

### 3.4 CJ Dropshipping Service
File: `/server/services/cj/cj.service.ts`
Direct API (not RapidAPI): `developers.cjdropshipping.com`

What to implement:
- `authenticate()` — CJ uses token-based auth, get token first, cache it
- `searchProducts(keyword, minPrice, maxPrice)` — product search
- `getSupplierInfo(productId)` — supplier details

Note: CJ tokens expire, so build a token refresh mechanism.

### 3.5 Google Shopping Service
File: `/server/services/rapidapi/google-shopping.service.ts`
RapidAPI product: **Google Shopping API** (`google-shopping-api.p.rapidapi.com`)

What to implement:
- `searchProducts(keyword, location, minPrice, maxPrice)` — returns retail listings with seller info

### 3.6 Amazon Service
File: `/server/services/rapidapi/amazon.service.ts`
RapidAPI product: **Real-Time Amazon Data API** (`real-time-amazon-data.p.rapidapi.com`)

What to implement:
- `searchProducts(keyword, location)` — product listings with pricing
- Returns seller name, rating, review count, price

### 3.7 eBay Service
File: `/server/services/rapidapi/ebay.service.ts`
RapidAPI product: **eBay API** (`ebay-data.p.rapidapi.com`)

What to implement:
- `searchProducts(keyword, location, minPrice, maxPrice)` — active listings
- Focus on sold listings if available — these confirm real demand

### 3.8 AI Analysis Service
File: `/server/services/ai/analysis.service.ts`
Uses: **Vercel AI SDK + OpenAI gpt-4o**

What to implement:
- `generateAnalysis(wholesaleData, competitiveData)` — takes structured data, returns aiSummary, aiMarketingStrategy, aiRecommendation
- Use `generateText()` from Vercel AI SDK
- Prompt should include: avg prices, margin, competitor count, supplier count, trend direction
- Response should be structured — prompt it to return JSON with defined fields, parse on receipt

---

## PHASE 4 — Normalizers

### 4.1 Why Normalizers Are Critical
Every platform returns different field names. AliExpress calls it `sale_price`, Amazon calls it `price`, eBay calls it `currentPrice`. You must normalize before saving to DB so your analysis logic works on consistent data.

### 4.2 Wholesale Normalizer
File: `/lib/normalizers/wholesale.normalizer.ts`

Input: raw responses from AliExpress + CJ
Output: two arrays — `products[]` and `suppliers[]` — both in your DB schema shape

Map these fields regardless of source:
- title, price, currency, imageUrl, productUrl, specs, variants, platform, externalId
- For supplier: storeName, rating, totalOrders, responseRate, shippingTime, country, storeUrl

### 4.3 Competitive Normalizer
File: `/lib/normalizers/competitive.normalizer.ts`

Input: raw responses from Google Shopping + Amazon + eBay
Output: two arrays — `products[]` and `sellers[]` — both in your DB schema shape

Map these fields:
- title, price, currency, imageUrl, productUrl, reviewCount, rating, platform, externalId
- For seller: sellerName, rating, reviewCount, storeUrl

---

## PHASE 5 — Server Actions

### 5.1 Finder Action
File: `/server/actions/finder.actions.ts`

This is the main orchestrator. Execution order:

1. Validate input with Zod (query, location, minPrice, maxPrice are required/optional)
2. Insert new row into `searches` table, get back `searchId`
3. Call `trendsService.getRisingQueries()` to get refined keyword
4. Call `trendsService.getInterestOverTime()` for trend score and direction
5. Update the `searches` row with refinedKeyword and trendData
6. Insert new row into `products` table with searchId and trend info, get back `productId`
7. Fire all 5 market searches in parallel using `Promise.all()`: AliExpress, CJ, Google Shopping, Amazon, eBay
8. Pass AliExpress + CJ results through wholesale normalizer
9. Pass Google Shopping + Amazon + eBay results through competitive normalizer
10. Bulk insert normalized wholesale products into `wholesale_products` table
11. Bulk insert normalized wholesale suppliers into `wholesale_suppliers` table
12. Bulk insert normalized competitive products into `competitive_products` table
13. Bulk insert normalized competitive sellers into `competitive_sellers` table
14. Return `{ productId, searchId }` to the client
15. Client redirects to `/dashboard/results?productId=xxx`

### 5.2 Analysis Action
File: `/server/actions/analysis.actions.ts`

Triggered when user clicks "Save & Analyze" on results page. Execution order:

1. Validate productId exists and belongs to current user
2. Update product status to `"analyzing"`
3. Fetch all wholesale products for this productId from DB
4. Fetch all competitive products for this productId from DB
5. Calculate avgWholesalePrice — sum all prices, divide by count
6. Calculate avgRetailPrice — same for competitive
7. Calculate profitMargin — `((avgRetail - avgWholesale) / avgRetail) * 100`
8. Calculate gapScore — custom score based on margin + competitor count (fewer competitors + higher margin = higher score)
9. Calculate opportunityScore (1–10) — weighted formula combining margin, gap, trend direction, competitor count
10. Call `analysisService.generateAnalysis()` with all calculated data → get AI text back
11. Insert into `product_reports` table with all calculated fields + AI output
12. Update product status to `"analyzed"`
13. Add entry to `saved_products` table for this user
14. Return `{ reportId, productId }`

### 5.3 Product Action
File: `/server/actions/product.actions.ts`

Implement:
- `getProductWithPanels(productId)` — fetches wholesale products + suppliers (left panel) and competitive products + sellers (right panel) in one query using Drizzle joins
- `saveProduct(userId, productId)` — inserts into saved_products if not already saved
- `unsaveProduct(userId, productId)` — removes from saved_products
- `getUserSavedProducts(userId)` — returns all saved products with their report status

### 5.4 Supplier Action
File: `/server/actions/supplier.actions.ts`

Implement:
- `getAllSuppliers(userId, filters)` — queries wholesale_suppliers for all products belonging to this user's searches. Filters: platform, minRating, country, shippingTime
- `getSuppliersByProduct(productId)` — all suppliers for a specific product

### 5.5 Report Action
File: `/server/actions/report.actions.ts`

Implement:
- `getProductReport(productId)` — returns the full product_reports row + joined product data
- `getNicheReports(userId)` — aggregates all user's product reports grouped by niche/keyword for the Market Reports page charts

---

## PHASE 6 — Page Implementation

### 6.1 /dashboard/finder — Product Finder Page

**Type:** Server Component with a Client form component inside it

**What to build:**
- Server Component renders the page shell
- Client Component (`FinderForm`) handles the form state
- Form fields: product name (text), location (select: US/UK/CA/AU/DE), min price (number), max price (number), shipping preference (select)
- On submit, call the `runProductSearch` server action
- While action is running, show a multi-step loading state: "Analyzing trends..." → "Searching wholesale markets..." → "Scanning competition..." → "Saving results..."
- On success, redirect to `/dashboard/results?productId=xxx`
- On error, show inline error with retry option

### 6.2 /dashboard/results — Search Results Page

**Type:** Server Component (reads from DB via searchParams productId)

**What to build:**
- Read `productId` from searchParams
- Fetch product + all related data from Supabase via server action
- Display 4 sections:
  1. **Trend Section** — keyword, trend score, direction badge, sparkline chart (use trend data from DB)
  2. **Trending Product** — show refined keyword vs raw query, explain why this was picked
  3. **Wholesale Market** — grid of product cards (AliExpress + CJ), each card shows: image, title, price, platform badge, supplier name, rating, shipping time
  4. **Competitive Market** — grid of product cards (Amazon + eBay + Google Shopping), each card shows: image, title, price, platform badge, seller name, rating, review count
- Sticky bottom bar with "Save & Analyze" button
- "Save & Analyze" calls `runAnalysis` server action, shows progress, redirects to `/dashboard/product/[id]`

### 6.3 /dashboard/product/[id] — Two-Panel Product View

**Type:** Server Component

**What to build:**
- Fetch product panels data using `getProductWithPanels(id)`
- **Left Panel — Wholesale:**
  - Header showing platform filter tabs (All / AliExpress / CJ)
  - Product cards: image, title, price, specs summary
  - Below each product card: supplier card with name, rating, orders, response rate, shipping time, country flag, link to store
- **Right Panel — Competitive:**
  - Header showing platform filter tabs (All / Amazon / eBay / Google Shopping)
  - Product cards: image, title, price, rating, review count
  - Below each product card: seller card with name, rating, review count, store link
- Top bar: product name, trend badge, "View Full Report" button → `/dashboard/product/[id]/report`
- If analysis is still running (status = "analyzing"), show a polling state on the "View Report" button using SWR to check status every 3 seconds

### 6.4 /dashboard/product/[id]/report — Analysis Report

**Type:** Server Component

**What to build:**
- Fetch from `product_reports` table
- **Metrics Bar** — 4 key stat cards: Avg Wholesale Price, Avg Retail Price, Profit Margin %, Opportunity Score
- **Price Comparison Chart** — bar chart comparing wholesale vs retail prices per platform (use Recharts or Chart.js)
- **Gap Analysis Section** — visual breakdown of the price gap with interpretation
- **AI Summary** — formatted text block with the AI-generated market analysis
- **AI Marketing Strategy** — step-by-step formatted list from AI output
- **Recommendation Badge** — large visual badge: Strong Buy (green) / Moderate (yellow) / Avoid (red)
- **Supplier Shortlist** — top 3 wholesale suppliers sorted by rating
- **Export Button** — downloads report data as CSV (client-side generation, no API needed)
- **Save Product Button** — calls `saveProduct` server action

### 6.5 /dashboard/suppliers — Supplier Library

**Type:** Server Component with client-side filter controls

**What to build:**
- On page load, call `getAllSuppliers(userId)` server action
- Display supplier cards in a filterable grid
- Filter controls (client-side, no re-fetch needed): platform, min rating, country, max shipping time
- Each supplier card shows: store name, platform badge, rating stars, total orders, response rate, shipping time, country, products count (how many of user's products this supplier appears in), link to store
- Clicking a supplier shows which of the user's searched products this supplier is associated with

### 6.6 /dashboard/saved — Saved Products

**Type:** Server Component

**What to build:**
- Call `getUserSavedProducts(userId)` to fetch all saved items
- Display product cards with: refined keyword, trend direction badge, profit margin (from report if analyzed), opportunity score, date saved, analysis status badge
- Search bar to filter saved products by keyword (client-side filter)
- Sort controls: by date saved, by profit margin, by opportunity score
- Each card links to `/dashboard/product/[id]`
- Unsave button on each card calls `unsaveProduct` server action

### 6.7 /dashboard/reports — Market Reports

**Type:** Server Component for data fetch, client charts

**What to build:**
- Call `getNicheReports(userId)` to get aggregated data
- **Niche Trend Chart** — line chart showing interest over time for each keyword the user has searched (uses trendData stored in DB)
- **Profit Margin Distribution** — bar chart showing margin range across all analyzed products
- **Platform Price Comparison** — grouped bar chart: wholesale price by platform vs retail price by platform
- **Opportunity Scores Table** — sortable table of all products with their scores
- **Download CSV Button** — exports all report data as CSV (client-side)

### 6.8 /dashboard — Overview

**Type:** Server Component

**What to build:**
- Fetch: recent searches (last 5), top opportunity products (top 3 by score), saved product count, total products analyzed
- **Stats Bar** — 4 cards: Products Analyzed, Avg Profit Margin, Saved Products, Searches This Month
- **Global Trends Widget** — calls trendsService for top 5 currently trending ecommerce categories (live, not cached)
- **Recent Searches** — last 5 searches with status and quick link
- **Top Opportunities** — top 3 products by opportunity score with margin and recommendation badge
- **Quick Search Bar** — shortcut to /dashboard/finder with pre-filled query

---

## PHASE 7 — Polling Strategy (SWR)

Only two places need client-side polling:

**Place 1: /dashboard/product/[id] — Analysis Status**
- When product status is `"analyzing"`, use SWR to poll `/api/product/[id]/status` every 3 seconds
- When status changes to `"analyzed"`, stop polling and enable the "View Report" button
- This avoids users staring at a loading screen with no feedback

**Place 2: /dashboard/finder — Search Progress**
- Use SWR or optimistic UI to show step-by-step progress while the server action runs
- Not true polling — just staged UI state managed on the client during the action call

---

## PHASE 8 — Error Handling Strategy

### API Failures
- Each service should have try/catch and return a typed result: `{ success: true, data }` or `{ success: false, error }`
- If AliExpress fails but CJ succeeds, still save CJ results — partial data is better than nothing
- If all wholesale APIs fail, don't save the product and return a clear error to the user
- Log all API failures to a `api_errors` table in Supabase (optional but useful for debugging)

### Analysis Failures
- If AI generation fails, still save the calculated metrics (margin, scores)
- Mark `aiSummary` as null and show a "AI analysis unavailable" message on the report
- Never block the report from showing due to AI failure

### Rate Limiting
- RapidAPI has per-minute rate limits on free/basic plans
- Add a simple queue: if a request fails with 429, wait 1 second and retry once
- Show users a "High demand, please wait..." message if retries fail

---

## PHASE 9 — Auth & User Flow

- Use Supabase Auth for all authentication
- Protect all `/dashboard/*` routes with middleware
- Create `middleware.ts` at root: checks Supabase session, redirects to `/login` if not authenticated
- All server actions must verify the user session at the start before any DB operation
- Never trust userId from the client — always get it from the server-side Supabase session

---

## PHASE 10 — Deployment

### Vercel Setup
- Connect GitHub repo to Vercel
- Add all environment variables in Vercel dashboard
- Set Node.js version to 20+
- Set function timeout to 60 seconds (finder action calls 5 APIs in parallel — needs time)

### Supabase Production
- Enable connection pooling (PgBouncer) for serverless compatibility
- Use the pooled connection string for Drizzle in production
- Set up Supabase backups

### RapidAPI
- Upgrade from free tier once you hit limits
- Monitor usage in RapidAPI dashboard
- Set billing alerts so you don't get surprise charges

---

## Implementation Order (Recommended)

```
Phase 1 + 2          → Project setup + full DB schema
Phase 3 + 4          → All API services + normalizers
Phase 5              → All server actions (core logic)
Phase 6 (finder + results + product pages)
Phase 6 (report + suppliers + saved + dashboard)
Phase 7 + 8 + 9      → Polling + errors + auth
Phase 10 + testing   → Deploy + end-to-end testing
```

---

This is your complete north star document. Every decision has a place, every page has a data source, and every API has a single responsibility. Want me to start generating the actual code for any specific phase?