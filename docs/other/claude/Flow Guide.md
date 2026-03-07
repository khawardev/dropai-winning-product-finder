## ✅ Validated Flow (Corrected & Clarified)

### Step 1 — User searches "Sony Headphones" on /dashboard/finder

```
User Input → "Sony Headphones" + filters (country, price, shipping)
```

**What happens:**
1. Check trend data for "Sony Headphones" on Google Trends
2. Google Trends also returns **related rising queries** (e.g., "Sony WH-1000XM5", "noise cancelling headphones")
3. You pick the **most trending variant** as the refined search term
4. That refined term becomes the query for all subsequent API calls

> ✅ This is the correct approach. Don't search wholesale with the raw user input — use the **trend-validated refined keyword.**

---

### Step 2 — Wholesale Market Search (Refined keyword → 3 platforms)

```
Refined keyword → AliExpress + Alibaba + CJ Dropshipping (parallel calls)
```

Each platform returns:
- Product listings (name, price, images, specs, variants)
- Supplier info (store name, rating, orders, response rate, shipping)

> ⚠️ **Validation issue:** Alibaba and CJ Dropshipping are NOT on RapidAPI reliably. Here's the reality:

| Platform | RapidAPI Available? | Alternative |
|----------|-------------------|-------------|
| AliExpress | ✅ Yes — solid API | `aliexpress-datahub.p.rapidapi.com` |
| Alibaba | ❌ No official API | Alibaba Open Platform (separate signup) |
| CJ Dropshipping | ❌ Not on RapidAPI | CJ's own REST API (free, direct) |

**Recommendation:** Use AliExpress via RapidAPI + CJ Dropshipping via their own free API. Skip Alibaba for now — it's B2B bulk, not ideal for dropshipping unit economics anyway.

---

### Step 3 — Competitive Market Search (Same refined keyword)

```
Refined keyword → Google Shopping + Amazon + eBay (parallel calls)
```

Each platform returns:
- Product listings at retail price
- Seller name, rating, number of reviews
- Shipping details

> ✅ All three available cleanly on RapidAPI.

---

### Step 4 — /dashboard/results view

You display 4 sections from raw API responses:

```
1. Trend Data          ← Google Trends API response
2. Trending Product    ← The refined keyword picked from trends
3. Wholesale Market    ← AliExpress + CJ products + their suppliers
4. Competitive Market  ← Google Shopping + Amazon + eBay products + sellers
```

User clicks **"Save & Analyze"** → triggers your backend to:
- Save everything to Supabase under one `product_id`
- Separate suppliers into `wholesale_suppliers` table and `competitive_sellers` table
- Queue the analysis job

> ✅ Correct approach. One `product_id` as the anchor for all related data.

---

### Step 5 — /dashboard/product/[id] — Two-panel view

```
Left Panel                    Right Panel
──────────────────────        ──────────────────────
WHOLESALE PRODUCTS            COMPETITIVE PRODUCTS
(AliExpress, CJ)              (Amazon, eBay, Shopify)
+ their suppliers             + their sellers
```

> ✅ Clean architecture. Both panels pull from your **Supabase DB** (already saved) — no live API calls needed here.

---

### Step 6 — /dashboard/product/[id]/report — Analysis

This is where analysis runs on saved data:

```
Wholesale prices  (from DB)  ─┐
Competitive prices (from DB) ─┤→ Gap & Profit Analysis → Report
Product specs     (from DB)  ─┘
```

Analysis includes:
- Profit margin per supplier
- Price gap (wholesale vs retail)
- Competition density score
- Market opportunity score
- AI-generated summary (Claude API)

> ✅ Using saved DB data here is the right call — never re-fetch for analysis, always use persisted data.

---

## 🗂️ Supabase Schema (Recommended)

```sql
-- Core search session
searches
  id, user_id, raw_query, refined_keyword, created_at

-- One product group per search
products
  id, search_id, refined_keyword, trend_score, trend_data(json), created_at

-- Wholesale side
wholesale_products
  id, product_id, platform, title, price, specs(json), images(json)

wholesale_suppliers
  id, product_id, platform, store_name, rating, total_orders, 
  response_rate, shipping_time, country

-- Competitive side  
competitive_products
  id, product_id, platform, title, price, url, images(json)

competitive_sellers
  id, product_id, platform, seller_name, rating, review_count, store_url

-- Analysis output
product_reports
  id, product_id, avg_wholesale_price, avg_retail_price, 
  profit_margin, gap_score, opportunity_score, ai_summary, created_at

-- Saved by user
saved_products
  id, user_id, product_id, saved_at
```

---

## 🔌 Final API Map (Revised & Validated)

| Step | Purpose | API | Where |
|------|---------|-----|-------|
| Trends + rising queries | Step 1 | Google Trends API | RapidAPI |
| AliExpress products + suppliers | Step 2 | AliExpress Datahub API | RapidAPI |
| CJ Dropshipping products + suppliers | Step 2 | CJ Dropshipping API | Direct (free) |
| Google Shopping competitors | Step 3 | Google Shopping API | RapidAPI |
| Amazon competitors | Step 3 | Real-Time Amazon Data API | RapidAPI |
| eBay competitors | Step 3 | eBay API | RapidAPI |
| AI gap + opportunity analysis | Step 6 | Claude API | Anthropic direct |

---

## ⚠️ 3 Issues to Fix in Your Concept

**Issue 1 — Alibaba doesn't fit dropshipping well**
Alibaba is MOQ-based (bulk orders). Replace it with CJ Dropshipping which is purpose-built for dropshippers with a free direct API.

**Issue 2 — Don't show raw JSON on /dashboard/results**
Your results page should transform API responses into a unified schema before displaying. Each platform returns different field names — normalize them first:
```js
// Normalize before saving to DB
const normalized = {
  title: item.product_title || item.name || item.title,
  price: item.sale_price || item.price || item.offer_price,
  supplier: item.store_name || item.seller || item.vendor,
}
```

**Issue 3 — Analysis should run async, not on click**
When user clicks "Save & Analyze", save immediately and show results page. Run the analysis job in the background (use a Supabase Edge Function or Next.js API route). Show a loading state on the report page until analysis is ready — don't make the user wait.

---

## 🏗️ Next.js API Routes Structure

```
/app/api/
  finder/
    search/route.js         ← Trends + refined keyword
  wholesale/
    aliexpress/route.js     ← AliExpress products + suppliers
    cj/route.js             ← CJ products + suppliers
  competitive/
    google/route.js         ← Google Shopping
    amazon/route.js         ← Amazon listings
    ebay/route.js           ← eBay listings
  product/
    save/route.js           ← Save all to Supabase
    [id]/report/route.js    ← Trigger + fetch analysis
  analysis/
    run/route.js            ← Gap + profit + AI summary
```

---

This architecture is solid and scalable. Want me to now build out the actual Next.js API route code for the finder flow (Step 1 + 2 + 3) as the starting point?