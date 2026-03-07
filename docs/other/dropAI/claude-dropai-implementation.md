# DropAI — Dropshipping Research Tool
## Complete Implementation Prompt for Next.js

---

> **How to use this document:**  
> Copy this entire prompt and give it to an AI coding assistant (like Claude, ChatGPT, or Cursor) to build your Next.js application from scratch.

---

## WHAT YOU ARE BUILDING

Build a **Next.js 14 dropshipping product research tool** called **DropAI**. The app helps dropshippers find profitable products by automatically searching the internet across multiple platforms — trend sites, wholesale marketplaces, and retail stores — then calculating profit margins and scoring opportunities.

The app uses **6 AI agents** that run in sequence. Each agent does one job. Together they take a niche keyword (e.g. "dog accessories") and return a full market analysis report.

---

## TECH STACK

| What | Use |
|------|-----|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI / Data Synthesis | Google Gemini 2.0 Flash API |
| Market Data | SerpApi (search, shopping, trends, eBay, Walmart) |
| Caching | Supabase PostgreSQL (24-hour cache to save API costs) |
| Language | TypeScript |

---

## THE 6-AGENT WORKFLOW

Each agent runs one after another. The UI shows live progress as each agent completes its job.

---

### AGENT 1 — Market Scout (Find Trending Products)

**Job:** Discover which products are trending right now in the user's chosen niche.

**How it works:**
1. Take the user's niche keyword (e.g. "dog accessories")
2. Call **SerpApi Google Trends API** with that keyword
3. Extract rising search queries from the `related_queries` field
4. Filter by the user's target country (e.g. US, UK, PK)
5. Use Gemini AI to validate which trends are growing fast vs. fading

**SerpApi call:**
```
GET https://serpapi.com/search
  ?engine=google_trends
  &q=dog accessories
  &data_type=RELATED_QUERIES
  &geo=US
  &date=today 3-m
  &api_key=YOUR_KEY
```

**Output:** List of 3–5 trending product ideas with trend velocity score (rising/stable/falling)

**Cache rule:** Store results in Supabase. If same niche + country was searched within 24 hours, return cached data instead of calling the API again.

---

### AGENT 2 — Sourcing Specialist (Find Wholesale Suppliers)

**Job:** For each trending product, find real wholesale suppliers with pricing and stock info.

**How it works:**
1. Take product names from Agent 1
2. Search **multiple wholesale platforms simultaneously:**
   - **AliExpress** — via SerpApi Google Search with `site:aliexpress.com`
   - **Alibaba** — via SerpApi Google Search with `site:alibaba.com`
   - **DHgate** — via SerpApi Google Search with `site:dhgate.com`
   - **Google Shopping B2B** — via SerpApi Google Shopping with merchant filter `tbs=mr:1`
3. Extract: product name, price per unit, minimum order quantity (MOQ), seller name, shipping options
4. Use Gemini AI to rank suppliers by reliability (based on ratings, review count, shipping speed)

**SerpApi calls:**
```
# AliExpress search
GET https://serpapi.com/search
  ?engine=google
  &q=portable dog water bottle site:aliexpress.com
  &num=20

# Alibaba search
GET https://serpapi.com/search
  ?engine=google
  &q=portable dog water bottle site:alibaba.com
  &num=20

# Google Shopping wholesale
GET https://serpapi.com/search
  ?engine=google_shopping
  &q=portable dog water bottle
  &tbs=mr:1
  &gl=US
```

**Output:** List of 3–5 suppliers per product with price, MOQ, shipping info, and reliability score

---

### AGENT 3 — Logistics Auditor (Validate Each Supplier)

**Job:** Get deep details on each supplier found by Agent 2 to verify they are trustworthy.

**How it works:**
1. Take supplier product IDs from Agent 2
2. Call **SerpApi Google Product API** for each product
3. Extract: detailed pricing tiers, exact shipping cost, estimated delivery time, return policy, seller rating history, buyer reviews
4. Use Gemini AI to calculate a final reliability score (0–100) per supplier

**SerpApi call:**
```
GET https://serpapi.com/search
  ?engine=google_product
  &product_id=PRODUCT_ID_FROM_AGENT_2
  &offers=1
  &reviews=1
  &api_key=YOUR_KEY
```

**Output:** Validated supplier cards showing: unit cost, shipping cost, delivery window, reliability score, recommended (yes/no)

---

### AGENT 4 — Intelligence Officer (Map the Competition)

**Job:** Find all the stores currently selling this product at retail prices across the internet.

**How it works:**
1. Take product names from Agent 1
2. Search across **multiple retail platforms simultaneously:**
   - **eBay** — via SerpApi eBay API (auctions + buy-it-now listings)
   - **Walmart** — via SerpApi Walmart API (big-box retail pricing)
   - **Google Shopping** — find Shopify stores and general retail listings
   - **Amazon** — via SerpApi Google Shopping filtered for amazon.com
3. Collect: seller name, retail price, shipping price, listing count, average rating

**SerpApi calls:**
```
# eBay
GET https://serpapi.com/search
  ?engine=ebay
  &_nkw=portable dog water bottle
  &ebay_domain=ebay.com

# Walmart
GET https://serpapi.com/search
  ?engine=walmart
  &query=portable dog water bottle

# Google Shopping
GET https://serpapi.com/search
  ?engine=google_shopping
  &q=portable dog water bottle
  &tbs=vw:g
```

**Output:** Competitive landscape map — who is selling, on which platforms, at what price range

---

### AGENT 5 — Performance Analyst (Benchmark Competitors)

**Job:** Find Shopify dropshipping stores specifically, and analyze how well they are performing.

**How it works:**
1. Search Google for Shopify stores selling the product:
   - Query: `intitle:"portable dog water bottle" site:myshopify.com`
2. Also search Google Shopping for detailed competitor pricing and reviews
3. Analyze: price distribution (lowest/average/highest), shipping speed claims, review quality, review count
4. Use Gemini AI to identify market weaknesses:
   - Are there price points nobody is covering?
   - Are competitors shipping slowly (opportunity for fast shipping)?
   - Are reviews mostly negative (product quality gap)?

**SerpApi calls:**
```
# Find Shopify stores
GET https://serpapi.com/search
  ?engine=google
  &q=intitle:"portable dog water bottle" site:myshopify.com

# Google Shopping competitor data
GET https://serpapi.com/search
  ?engine=google_shopping
  &q=portable dog water bottle
  &tbm=shop
```

**Output:** Competitor benchmark table — price range, avg reviews, shipping speed, identified weaknesses

---

### AGENT 6 — Financial Architect (Profit & Gap Analysis)

**Job:** Combine all data from Agents 1–5 and calculate if this product is worth pursuing.

**How it works:**
1. Pull wholesale cost from Agent 3 (best supplier)
2. Pull average retail price from Agent 4 + 5
3. Calculate:
   - **Gross Margin** = Retail Price − Wholesale Cost
   - **Net Margin** = Gross Margin − Shipping Cost − Estimated Ad Spend (30% of retail)
   - **Market Gap Score** = function of (how many competitors, price spread, review quality)
4. Use Gemini AI to synthesize everything into a final report:
   - Opportunity rating: HIGH / MEDIUM / LOW
   - Recommended retail price
   - Recommended supplier
   - Top 3 risks
   - Go / No-Go recommendation

**No extra API call needed** — uses aggregated data from all previous agents.

**Output:** Final investment-grade report card with profit calculator and go/no-go badge

---

## DATABASE SCHEMA (Supabase)

Create these tables in Supabase:

```sql
-- Cache for trend searches
CREATE TABLE trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche TEXT NOT NULL,
  country TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cache for supplier searches
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cache for competitor searches
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Save full research reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche TEXT NOT NULL,
  country TEXT NOT NULL,
  report JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Cache logic:** Before every SerpApi call, check: `SELECT * FROM [table] WHERE product_name=$1 AND created_at > NOW() - INTERVAL '24 hours'`. If a row exists, return cached data. If not, call SerpApi and save the result.

---

## FILE STRUCTURE

```
/app
  /page.tsx                  ← Homepage with search form
  /research/[id]/page.tsx    ← Research results page (shows agent progress)
  /api
    /research/route.ts       ← Main API: starts the 6-agent workflow
    /agents
      /trends/route.ts       ← Agent 1
      /sourcing/route.ts     ← Agent 2
      /logistics/route.ts    ← Agent 3
      /intelligence/route.ts ← Agent 4
      /performance/route.ts  ← Agent 5
      /financial/route.ts    ← Agent 6

/lib
  /serpapi.ts                ← All SerpApi call functions
  /gemini.ts                 ← All Gemini AI call functions
  /supabase.ts               ← Database client + cache helpers
  /types.ts                  ← TypeScript types for all data shapes

/components
  /AgentCard.tsx             ← Shows one agent's status + results
  /AgentProgress.tsx         ← Live progress bar across all 6 agents
  /ProductCard.tsx           ← Displays a trending product
  /SupplierCard.tsx          ← Displays a wholesale supplier
  /CompetitorTable.tsx       ← Shows competitive landscape
  /ReportCard.tsx            ← Final go/no-go report with profit calculator
```

---

## UI REQUIREMENTS

### Home Page
- Clean search form with two inputs:
  - Niche keyword (text field, e.g. "dog accessories")
  - Target country (dropdown: US, UK, CA, AU, PK, etc.)
- "Start Research" button
- Brief explanation of what the tool does

### Research Page (Live Progress)
- Show 6 agent cards in a vertical timeline layout
- Each card has 3 states:
  - **Waiting** — grey, not started yet
  - **Running** — animated pulse, shows what it's doing
  - **Complete** — green checkmark, shows summary of findings
- As each agent completes, its results expand inline (no page refresh needed)
- Use **Server-Sent Events (SSE)** or **polling every 2 seconds** to stream progress to the UI

### Final Report Section (appears after Agent 6)
- Large GO / NO-GO badge (green or red)
- Profit calculator: shows wholesale cost → retail price → net margin
- Market Gap Score (0–100 gauge chart)
- Top supplier recommendation card
- Competitor overview table
- Gemini's 3 key risks listed
- "Save Report" button (saves to Supabase)

---

## ENVIRONMENT VARIABLES

```env
SERPAPI_KEY=your_serpapi_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
```

---

## AGENT SEQUENCING LOGIC

```
User submits form
        ↓
Agent 1 runs → returns trending products
        ↓
Agent 2 runs (using Agent 1 output) → returns suppliers
        ↓
Agent 3 runs (using Agent 2 output) → returns validated suppliers
        ↓
Agent 4 runs (using Agent 1 output) → returns competitor landscape
        ↓
Agent 5 runs (using Agent 1 + 4 output) → returns benchmarks
        ↓
Agent 6 runs (using ALL outputs) → returns final report
        ↓
Display complete report to user
```

Each agent should update the UI with its status as it runs. If any agent fails, show an error on that card and continue with available data.

---

## IMPORTANT RULES

1. **Always check Supabase cache first** before calling SerpApi — saves money
2. **Run Agents 1, 2, 4 in parallel** where possible — Agent 1 results feed 2 and 4 simultaneously
3. **Agent 3 depends on Agent 2** — cannot start until Agent 2 finishes
4. **Agent 5 depends on Agents 1 and 4** — cannot start until both finish
5. **Agent 6 depends on ALL agents** — always runs last
6. All SerpApi calls must have proper **error handling** — if a platform returns no results, continue without crashing
7. Gemini should always receive **structured prompts** — include all raw data and ask for JSON output only
8. Keep all API keys **server-side only** — never expose them to the browser

---

*Build this application step by step. Start with the database schema, then the SerpApi helper functions, then each agent route, then the UI components, and finally wire everything together on the research page.*