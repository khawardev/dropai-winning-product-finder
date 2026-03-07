Here's your complete structured project prompt — ready to use as a reference document, share with collaborators, or feed into any AI coding tool.

---

# 🛍️ Dropshipping Research Platform — Project Brief

---

## 🧭 Project Overview

A Next.js SaaS application that automates the full dropshipping product research workflow. Users search for a product, the platform analyzes market trends, discovers wholesale suppliers, scans competitive markets, and generates a profit & gap analysis report — all in one unified flow.

**Subscription:** $79/month Pro plan per user

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Server Logic | Server Actions (`/server/actions/`) |
| Client Fetching | SWR (polling & client-side only where needed) |
| Rendering | Server Components (default), Client Components (forms, charts, polling) |
| AI Generation | Vercel AI SDK + OpenAI (gpt-4o) |
| Database | Supabase (PostgreSQL) |
| ORM | Drizzle ORM |
| Schema Location | `/server/db/schema/` |
| Migrations Location | `/server/db/migrations/` |
| External APIs | RapidAPI (single key) + CJ Dropshipping (direct) |

---

## 🔌 API Strategy

### Single Hub: RapidAPI
One API key, one billing dashboard, consistent fetch pattern across all services.

```
X-RapidAPI-Key   → process.env.RAPIDAPI_KEY
X-RapidAPI-Host  → per-service host header
```

### RapidAPI Services Used

| Purpose | RapidAPI Service | Host |
|---|---|---|
| Trend signals + rising queries | Google Trends API | `google-trends8.p.rapidapi.com` |
| Wholesale products + suppliers | AliExpress Datahub API | `aliexpress-datahub.p.rapidapi.com` |
| Competitive pricing (Amazon) | Real-Time Amazon Data API | `real-time-amazon-data.p.rapidapi.com` |
| Competitive pricing (eBay) | eBay Data API | `ebay-data.p.rapidapi.com` |
| Competitive pricing (Google) | Google Shopping API | `google-shopping-api.p.rapidapi.com` |

### Direct API (Outside RapidAPI)
| Purpose | Service |
|---|---|
| Wholesale products + suppliers | CJ Dropshipping API (free, direct REST) |

### Why Not Alibaba?
Alibaba is MOQ-based bulk ordering — not suited for dropshipping unit economics. CJ Dropshipping is the correct replacement: purpose-built for dropshippers, free API, no approval delays.

---

## 🔄 Core Product Research Workflow

This is the heart of the application. Every page exists to serve one or more steps of this workflow.

```
USER INPUT
────────────────────────────────────────────────
Product Name  →  "Sony Headphones"
Location      →  "US"
Price Range   →  "$20 – $100"  (optional)

                    ↓

STEP 1 — TREND IDENTIFICATION
────────────────────────────────────────────────
API: Google Trends (RapidAPI)
- Get interest score for raw query
- Get rising related queries
- Pick top rising query as "Refined Keyword"
  e.g. "Sony Headphones" → "Sony WH-1000XM5"
- Get trend direction: rising / stable / falling

                    ↓

STEP 2 — WHOLESALE MARKET SEARCH
────────────────────────────────────────────────
Query: Refined Keyword (parallel calls)
APIs: AliExpress (RapidAPI) + CJ Dropshipping (direct)

For each result, collect:
  PRODUCT DATA           SUPPLIER DATA
  ─────────────          ─────────────
  Title                  Store Name
  Price                  Rating
  Images                 Total Orders
  Specs / Variants       Response Rate
  Product URL            Shipping Time
  Platform               Country
                         Store URL

                    ↓

STEP 3 — COMPETITIVE MARKET SEARCH
────────────────────────────────────────────────
Query: Same Refined Keyword (parallel calls)
APIs: Amazon + eBay + Google Shopping (all via RapidAPI)

For each result, collect:
  PRODUCT DATA           SELLER DATA
  ─────────────          ───────────
  Title                  Seller Name
  Price                  Rating
  Images                 Review Count
  Rating / Reviews       Store URL
  Product URL
  Platform

                    ↓

STEP 4 — SAVE TO DATABASE
────────────────────────────────────────────────
Everything saved under one product_id in Supabase:
- Trend data
- Wholesale products + suppliers (separate table)
- Competitive products + sellers (separate table)

                    ↓

STEP 5 — GAP & PROFIT ANALYSIS
────────────────────────────────────────────────
Runs on saved DB data (no re-fetching APIs)

Plain Logic:
- Avg wholesale price across AliExpress + CJ
- Avg retail price across Amazon + eBay + Google
- Profit margin = ((retail - wholesale) / retail) × 100
- Gap score = margin + low competition weighting
- Opportunity score = 1–10 composite

AI Layer (Vercel AI SDK + OpenAI):
- Market gap narrative
- Business opportunity assessment
- 3-step marketing strategy
- Final recommendation: Strong Buy / Moderate / Avoid
```

---

## 📁 Project File Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                       # Overview
│   │   ├── finder/page.tsx                # Product Finder
│   │   ├── results/page.tsx               # Search Results
│   │   ├── saved/page.tsx                 # Saved Products
│   │   ├── suppliers/page.tsx             # Supplier Library
│   │   ├── reports/page.tsx               # Market Reports
│   │   ├── settings/page.tsx              # Account Settings
│   │   └── product/
│   │       └── [id]/
│   │           ├── page.tsx               # Two-panel product view
│   │           └── report/page.tsx        # Full analysis report
│   └── (auth)/
│       ├── login/page.tsx
│       └── register/page.tsx
│
├── server/
│   ├── actions/
│   │   ├── finder.actions.ts              # Main search orchestrator
│   │   ├── analysis.actions.ts            # Gap + profit + AI analysis
│   │   ├── product.actions.ts             # Save, fetch, unsave product
│   │   ├── supplier.actions.ts            # Supplier queries
│   │   └── report.actions.ts              # Fetch report + chart data
│   │
│   ├── services/
│   │   ├── rapidapi/
│   │   │   ├── client.ts                  # Base RapidAPI fetcher
│   │   │   ├── trends.service.ts
│   │   │   ├── aliexpress.service.ts
│   │   │   ├── amazon.service.ts
│   │   │   ├── ebay.service.ts
│   │   │   └── google-shopping.service.ts
│   │   ├── cj/
│   │   │   └── cj.service.ts
│   │   └── ai/
│   │       └── analysis.service.ts        # Vercel AI SDK calls
│   │
│   └── db/
│       ├── index.ts                       # Drizzle client
│       ├── schema/
│       │   ├── index.ts                   # Re-export all
│       │   ├── searches.ts
│       │   ├── products.ts
│       │   ├── wholesale-products.ts
│       │   ├── wholesale-suppliers.ts
│       │   ├── competitive-products.ts
│       │   ├── competitive-sellers.ts
│       │   ├── product-reports.ts
│       │   └── saved-products.ts
│       └── migrations/
│           └── 0001_initial.sql
│
└── lib/
    ├── normalizers/
    │   ├── wholesale.normalizer.ts        # Normalize AliExpress + CJ → unified shape
    │   └── competitive.normalizer.ts     # Normalize Amazon + eBay + Google → unified shape
    └── calculators/
        └── profit.calculator.ts          # Margin, gap, opportunity score logic
```

---

## 🗄️ Database Schema (Supabase + Drizzle)

### Table Relationships

```
searches
  └── products (one search → one product record)
        ├── wholesale_products  (many per product)
        │     └── wholesale_suppliers  (one per wholesale product)
        ├── competitive_products (many per product)
        │     └── competitive_sellers  (one per competitive product)
        ├── product_reports  (one per product, created after analysis)
        └── saved_products   (join table: user ↔ product)
```

### Table Definitions

**searches**
```
id               uuid  PK
user_id          uuid  NOT NULL
raw_query        text  "Sony Headphones"
location         text  "US"
min_price        text  optional
max_price        text  optional
refined_keyword  text  "Sony WH-1000XM5" (set after trends API)
trend_data       jsonb full trends API response
created_at       timestamp
```

**products**
```
id               uuid  PK
search_id        uuid  FK → searches.id
refined_keyword  text
trend_score      text
trend_direction  text  "rising" | "stable" | "falling"
status           text  "pending" | "analyzing" | "analyzed"
created_at       timestamp
```

**wholesale_products**
```
id               uuid  PK
product_id       uuid  FK → products.id
platform         text  "aliexpress" | "cj"
external_id      text
title            text
price            text
currency         text
image_url        text
product_url      text
specs            jsonb
variants         jsonb
raw_data         jsonb
created_at       timestamp
```

**wholesale_suppliers**
```
id                    uuid  PK
product_id            uuid  FK → products.id
wholesale_product_id  uuid  FK → wholesale_products.id
platform              text
store_name            text
rating                text
total_orders          text
response_rate         text
shipping_time         text
country               text
store_url             text
raw_data              jsonb
created_at            timestamp
```

**competitive_products**
```
id               uuid  PK
product_id       uuid  FK → products.id
platform         text  "amazon" | "ebay" | "google_shopping"
external_id      text
title            text
price            text
currency         text
image_url        text
product_url      text
review_count     text
rating           text
raw_data         jsonb
created_at       timestamp
```

**competitive_sellers**
```
id                       uuid  PK
product_id               uuid  FK → products.id
competitive_product_id   uuid  FK → competitive_products.id
platform                 text
seller_name              text
rating                   text
review_count             text
store_url                text
raw_data                 jsonb
created_at               timestamp
```

**product_reports**
```
id                    uuid  PK
product_id            uuid  FK → products.id  UNIQUE
avg_wholesale_price   text
avg_retail_price      text
profit_margin         text
gap_score             text
opportunity_score     text  "1" – "10"
competitor_count      text
supplier_count        text
ai_summary            text
ai_marketing_strategy text
ai_recommendation     text  "strong-buy" | "moderate" | "avoid"
raw_analysis          jsonb
created_at            timestamp
```

**saved_products**
```
id          uuid  PK
user_id     uuid  NOT NULL
product_id  uuid  FK → products.id
saved_at    timestamp
```

---

## 📄 Page-by-Page Specification

---

### `/dashboard` — Overview
**Rendering:** Server Component
**Data source:** Supabase (user's own data)
**Live data:** Google Trends API (global trending categories widget)

**Displays:**
- Stats bar: Products Analyzed, Avg Profit Margin, Saved Products, Searches This Month
- Global trending categories widget (live API call)
- Last 5 searches with status badges
- Top 3 products by opportunity score
- Quick search shortcut to `/dashboard/finder`

---

### `/dashboard/finder` — Product Finder
**Rendering:** Server Component shell + Client Component form
**Data source:** User input → triggers server action

**Form inputs:**
- Product name (text, required)
- Location (select: US / UK / CA / AU / DE)
- Min price (number, optional)
- Max price (number, optional)
- Shipping preference (select: any / under 2 weeks / ePacket)

**On submit:**
1. Calls `runProductSearch` server action
2. Shows multi-step loading UI:
   - "Analyzing trends..."
   - "Searching wholesale markets..."
   - "Scanning competition..."
   - "Saving results..."
3. On success → redirect to `/dashboard/results?productId=xxx`

---

### `/dashboard/results` — Search Results
**Rendering:** Server Component
**Data source:** Supabase (already saved by finder action)

**Displays 4 sections:**

1. **Trend Section**
   - Raw query vs refined keyword
   - Trend score + direction badge
   - Sparkline interest chart

2. **Trending Product**
   - Why this keyword was picked
   - Interest score breakdown

3. **Wholesale Market**
   - Product cards grid (AliExpress + CJ)
   - Each card: image, title, price, platform badge
   - Below each card: supplier info (name, rating, orders, shipping, country)

4. **Competitive Market**
   - Product cards grid (Amazon + eBay + Google Shopping)
   - Each card: image, title, price, platform badge
   - Below each card: seller info (name, rating, reviews, store link)

**Action:** Sticky "Save & Analyze" button
- Calls `runAnalysis` server action
- Shows progress state
- Redirects to `/dashboard/product/[id]`

---

### `/dashboard/product/[id]` — Two-Panel Product View
**Rendering:** Server Component
**Data source:** Supabase

**Layout:**

```
┌─────────────────────┬─────────────────────┐
│   WHOLESALE SIDE    │  COMPETITIVE SIDE   │
│                     │                     │
│  Platform tabs:     │  Platform tabs:     │
│  All/AliExpress/CJ  │  All/Amazon/eBay/   │
│                     │  Google             │
│  [Product Card]     │  [Product Card]     │
│  [Supplier Card]    │  [Seller Card]      │
│                     │                     │
│  [Product Card]     │  [Product Card]     │
│  [Supplier Card]    │  [Seller Card]      │
└─────────────────────┴─────────────────────┘
```

**Top bar:** Product name, trend badge, "View Full Report" button
**Polling:** If status = "analyzing", SWR polls every 3s until status = "analyzed", then enables "View Report" button

---

### `/dashboard/product/[id]/report` — Analysis Report
**Rendering:** Server Component
**Data source:** Supabase (`product_reports` table)

**Displays:**
- Metrics bar: Avg Wholesale Price / Avg Retail Price / Profit Margin % / Opportunity Score
- Price comparison chart (wholesale vs retail per platform)
- Gap analysis visual breakdown
- AI summary (market narrative)
- AI marketing strategy (step-by-step)
- Recommendation badge: Strong Buy / Moderate / Avoid
- Top 3 suppliers shortlist
- Export CSV button (client-side, no API)
- Save Product button → calls `saveProduct` action

---

### `/dashboard/suppliers` — Supplier Library
**Rendering:** Server Component + client filter controls
**Data source:** Supabase (`wholesale_suppliers` table, scoped to user's products)

**Displays:**
- Filterable supplier grid
- Filters: platform, min rating, country, max shipping time
- Each card: store name, platform badge, rating, orders, response rate, shipping, country, linked products count

---

### `/dashboard/saved` — Saved Products
**Rendering:** Server Component
**Data source:** Supabase (`saved_products` joined with `products` + `product_reports`)

**Displays:**
- Product cards with: keyword, trend badge, margin, opportunity score, date saved, status
- Client-side search filter
- Sort by: date saved / profit margin / opportunity score
- Unsave button per card

---

### `/dashboard/reports` — Market Reports
**Rendering:** Server Component + client chart components
**Data source:** Supabase (aggregated from user's product history)

**Displays:**
- Niche trend comparison chart (line chart, multiple keywords over time)
- Profit margin distribution chart (bar chart)
- Platform price comparison chart (grouped bars: wholesale vs retail per platform)
- Opportunity scores table (sortable)
- Download CSV button

---

### `/dashboard/settings` — Account Settings
**Rendering:** Server Component + client form
**Data source:** Supabase + Stripe

**Sections:**
- Profile (name, email, avatar)
- Subscription management (Stripe billing portal link)
- API key generation (for external integrations)
- Email alert preferences

---

## ⚡ Server Actions Reference

| Action File | Function | Purpose |
|---|---|---|
| `finder.actions.ts` | `runProductSearch()` | Full search orchestrator: trends → wholesale → competitive → save to DB |
| `analysis.actions.ts` | `runAnalysis()` | Calculate margins + run AI → save to product_reports |
| `product.actions.ts` | `getProductWithPanels()` | Fetch two-panel data from DB |
| `product.actions.ts` | `saveProduct()` | Add to saved_products |
| `product.actions.ts` | `unsaveProduct()` | Remove from saved_products |
| `product.actions.ts` | `getUserSavedProducts()` | All saved products for user |
| `supplier.actions.ts` | `getAllSuppliers()` | All suppliers scoped to user, with filters |
| `supplier.actions.ts` | `getSuppliersByProduct()` | Suppliers for a specific product |
| `report.actions.ts` | `getProductReport()` | Full report row + joined data |
| `report.actions.ts` | `getNicheReports()` | Aggregated chart data for /reports page |

---

## 🔁 SWR Polling (Client-Side Only)

Used in exactly 2 places:

**1. `/dashboard/product/[id]` — Analysis status check**
- Trigger: product status = `"analyzing"`
- Polls: every 3 seconds
- Stops: when status = `"analyzed"`
- Effect: enables "View Report" button

**2. `/dashboard/finder` — Search progress UI**
- Not true polling — staged UI state during server action execution
- Shows step-by-step progress labels while action runs

---

## 🛡️ Error Handling Rules

| Scenario | Behavior |
|---|---|
| One wholesale API fails | Save results from other platforms, continue |
| All wholesale APIs fail | Return error to user, do not save product |
| AI generation fails | Save calculated metrics, mark AI fields as null, show fallback UI |
| RapidAPI rate limit (429) | Wait 1s, retry once, show "High demand" message if still failing |
| Analysis DB write fails | Return error, keep product status as "pending" |

---

## 🔐 Auth Rules

- All `/dashboard/*` routes protected via `middleware.ts`
- Middleware checks Supabase session server-side
- Unauthenticated users → redirect to `/login`
- All server actions validate session at the start
- `userId` always sourced from server-side session — never from client

---

## 🌐 Environment Variables

```
RAPIDAPI_KEY                    # Single key for all RapidAPI services
CJ_API_KEY                      # CJ Dropshipping direct API
OPENAI_API_KEY                  # Vercel AI SDK
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY       # Server-side Supabase access
DATABASE_URL                    # Supabase Postgres (pooled for production)
```

---

## 🗓️ Build Order

```
Phase 1  →  Project init, env setup, Supabase project, Drizzle config
Phase 2  →  All DB schema files + run initial migration
Phase 3  →  RapidAPI base client + all service files + CJ service
Phase 4  →  Wholesale + competitive normalizers + profit calculator
Phase 5  →  All server actions (finder → analysis → product → supplier → report)
Phase 6  →  Pages: finder → results → product/[id] → report
Phase 7  →  Pages: dashboard → saved → suppliers → reports → settings
Phase 8  →  SWR polling, error handling, auth middleware
Phase 9  →  Deploy to Vercel, production env vars, Supabase connection pooling
```

---

This document is your single source of truth for the entire project. Every decision — API, schema, page, action, error — is defined here.