## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                          # Overview
│   │   ├── finder/
│   │   │   └── page.tsx                      # Product Finder
│   │   ├── results/
│   │   │   └── page.tsx                      # Search Results
│   │   ├── saved/
│   │   │   └── page.tsx                      # Saved Products
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       ├── page.tsx                  # Two-panel view
│   │   │       └── report/
│   │   │           └── page.tsx              # Deep analysis report
│   │   ├── suppliers/
│   │   │   └── page.tsx                      # Supplier Library
│   │   └── reports/
│   │       └── page.tsx                      # Market Reports
│
├── server/
│   ├── actions/
│   │   ├── finder.actions.ts                 # Trigger full search flow
│   │   ├── product.actions.ts                # Save, fetch product
│   │   ├── supplier.actions.ts               # Supplier queries
│   │   ├── analysis.actions.ts               # Run gap/profit analysis
│   │   └── report.actions.ts                 # Fetch report data
│   │
│   ├── db/
│   │   ├── index.ts                          # Drizzle client
│   │   ├── schema/
│   │   │   ├── index.ts                      # Export all schemas
│   │   │   ├── searches.ts
│   │   │   ├── products.ts
│   │   │   ├── wholesale.ts
│   │   │   ├── competitive.ts
│   │   │   ├── suppliers.ts
│   │   │   ├── reports.ts
│   │   │   └── saved.ts
│   │   └── migrations/
│   │       └── 0001_initial.sql
│   │
│   └── services/
│       ├── rapidapi/
│       │   ├── client.ts                     # Base RapidAPI fetcher
│       │   ├── trends.service.ts             # Google Trends
│       │   ├── aliexpress.service.ts         # AliExpress
│       │   ├── google-shopping.service.ts    # Google Shopping
│       │   ├── amazon.service.ts             # Amazon
│       │   └── ebay.service.ts               # eBay
│       ├── cj/
│       │   └── cj.service.ts                 # CJ Dropshipping direct
│       └── ai/
│           └── analysis.service.ts           # Vercel AI SDK + OpenAI
│
└── lib/
    ├── normalizers/
    │   ├── wholesale.normalizer.ts           # Normalize AliExpress + CJ
    │   └── competitive.normalizer.ts         # Normalize Amazon + eBay + Google
    └── calculators/
        └── profit.calculator.ts              # Margin + gap logic
```

---

## 🗄️ Drizzle Schema

```ts
// server/db/schema/searches.ts
import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const searches = pgTable("searches", {
  id:             uuid("id").primaryKey().defaultRandom(),
  userId:         uuid("user_id").notNull(),
  rawQuery:       text("raw_query").notNull(),          // "Sony Headphones"
  location:       text("location").notNull(),            // "US"
  minPrice:       text("min_price"),                     // "20"
  maxPrice:       text("max_price"),                     // "100"
  refinedKeyword: text("refined_keyword"),               // "Sony WH-1000XM5"
  trendData:      jsonb("trend_data"),                   // raw trends response
  createdAt:      timestamp("created_at").defaultNow(),
});
```

```ts
// server/db/schema/products.ts
export const products = pgTable("products", {
  id:              uuid("id").primaryKey().defaultRandom(),
  searchId:        uuid("search_id").references(() => searches.id),
  refinedKeyword:  text("refined_keyword").notNull(),
  trendScore:      text("trend_score"),
  trendDirection:  text("trend_direction"),             // "rising" | "stable" | "falling"
  status:          text("status").default("pending"),   // "pending" | "analyzed"
  createdAt:       timestamp("created_at").defaultNow(),
});
```

```ts
// server/db/schema/wholesale.ts
export const wholesaleProducts = pgTable("wholesale_products", {
  id:          uuid("id").primaryKey().defaultRandom(),
  productId:   uuid("product_id").references(() => products.id),
  platform:    text("platform").notNull(),              // "aliexpress" | "cj"
  externalId:  text("external_id"),
  title:       text("title"),
  price:       text("price"),
  currency:    text("currency").default("USD"),
  imageUrl:    text("image_url"),
  productUrl:  text("product_url"),
  specs:       jsonb("specs"),
  variants:    jsonb("variants"),
  rawData:     jsonb("raw_data"),                       // full API response
  createdAt:   timestamp("created_at").defaultNow(),
});

export const wholesaleSuppliers = pgTable("wholesale_suppliers", {
  id:             uuid("id").primaryKey().defaultRandom(),
  productId:      uuid("product_id").references(() => products.id),
  wholesaleProductId: uuid("wholesale_product_id").references(() => wholesaleProducts.id),
  platform:       text("platform").notNull(),
  storeName:      text("store_name"),
  rating:         text("rating"),
  totalOrders:    text("total_orders"),
  responseRate:   text("response_rate"),
  shippingTime:   text("shipping_time"),
  country:        text("country"),
  storeUrl:       text("store_url"),
  rawData:        jsonb("raw_data"),
  createdAt:      timestamp("created_at").defaultNow(),
});
```

```ts
// server/db/schema/competitive.ts
export const competitiveProducts = pgTable("competitive_products", {
  id:          uuid("id").primaryKey().defaultRandom(),
  productId:   uuid("product_id").references(() => products.id),
  platform:    text("platform").notNull(),              // "amazon" | "ebay" | "google_shopping"
  externalId:  text("external_id"),
  title:       text("title"),
  price:       text("price"),
  currency:    text("currency").default("USD"),
  imageUrl:    text("image_url"),
  productUrl:  text("product_url"),
  reviewCount: text("review_count"),
  rating:      text("rating"),
  rawData:     jsonb("raw_data"),
  createdAt:   timestamp("created_at").defaultNow(),
});

export const competitiveSellers = pgTable("competitive_sellers", {
  id:           uuid("id").primaryKey().defaultRandom(),
  productId:    uuid("product_id").references(() => products.id),
  competitiveProductId: uuid("competitive_product_id").references(() => competitiveProducts.id),
  platform:     text("platform").notNull(),
  sellerName:   text("seller_name"),
  rating:       text("rating"),
  reviewCount:  text("review_count"),
  storeUrl:     text("store_url"),
  rawData:      jsonb("raw_data"),
  createdAt:    timestamp("created_at").defaultNow(),
});
```

```ts
// server/db/schema/reports.ts
export const productReports = pgTable("product_reports", {
  id:                  uuid("id").primaryKey().defaultRandom(),
  productId:           uuid("product_id").references(() => products.id).unique(),
  avgWholesalePrice:   text("avg_wholesale_price"),
  avgRetailPrice:      text("avg_retail_price"),
  profitMargin:        text("profit_margin"),
  gapScore:            text("gap_score"),
  opportunityScore:    text("opportunity_score"),
  competitorCount:     text("competitor_count"),
  supplierCount:       text("supplier_count"),
  aiSummary:           text("ai_summary"),
  aiMarketingStrategy: text("ai_marketing_strategy"),
  aiRecommendation:    text("ai_recommendation"),       // "strong buy" | "moderate" | "avoid"
  rawAnalysis:         jsonb("raw_analysis"),
  createdAt:           timestamp("created_at").defaultNow(),
});
```

```ts
// server/db/schema/saved.ts
export const savedProducts = pgTable("saved_products", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").notNull(),
  productId: uuid("product_id").references(() => products.id),
  savedAt:   timestamp("saved_at").defaultNow(),
});
```

---

## ⚙️ Server Actions

```ts
// server/actions/finder.actions.ts
"use server";

export async function runProductSearch(input: {
  query: string;
  location: string;
  minPrice?: string;
  maxPrice?: string;
  userId: string;
}) {
  // 1. Save the search session
  const [search] = await db.insert(searches).values({
    userId: input.userId,
    rawQuery: input.query,
    location: input.location,
    minPrice: input.minPrice,
    maxPrice: input.maxPrice,
  }).returning();

  // 2. Get trend data + refined keyword (parallel)
  const [trendData] = await Promise.all([
    trendsService.getInterestAndRising(input.query, input.location),
  ]);

  const refinedKeyword = trendData.risingQueries?.[0] ?? input.query;

  // 3. Update search with trend info
  await db.update(searches)
    .set({ refinedKeyword, trendData })
    .where(eq(searches.id, search.id));

  // 4. Create product record
  const [product] = await db.insert(products).values({
    searchId: search.id,
    refinedKeyword,
    trendScore: trendData.score,
    trendDirection: trendData.direction,
  }).returning();

  // 5. Fire all market searches in parallel
  const [aliExpress, cj, googleShopping, amazon, ebay] = await Promise.all([
    aliExpressService.searchProducts(refinedKeyword, input),
    cjService.searchProducts(refinedKeyword, input),
    googleShoppingService.search(refinedKeyword, input),
    amazonService.search(refinedKeyword, input),
    ebayService.search(refinedKeyword, input),
  ]);

  // 6. Normalize + save wholesale
  const normalizedWholesale = normalizeWholesale([...aliExpress, ...cj]);
  await db.insert(wholesaleProducts).values(
    normalizedWholesale.products.map(p => ({ ...p, productId: product.id }))
  );
  await db.insert(wholesaleSuppliers).values(
    normalizedWholesale.suppliers.map(s => ({ ...s, productId: product.id }))
  );

  // 7. Normalize + save competitive
  const normalizedCompetitive = normalizeCompetitive([...googleShopping, ...amazon, ...ebay]);
  await db.insert(competitiveProducts).values(
    normalizedCompetitive.products.map(p => ({ ...p, productId: product.id }))
  );
  await db.insert(competitiveSellers).values(
    normalizedCompetitive.sellers.map(s => ({ ...s, productId: product.id }))
  );

  return { productId: product.id, searchId: search.id };
}
```

```ts
// server/actions/analysis.actions.ts
"use server";

export async function runAnalysis(productId: string) {
  // 1. Fetch all saved data from DB
  const [wholesale, competitive] = await Promise.all([
    db.select().from(wholesaleProducts).where(eq(wholesaleProducts.productId, productId)),
    db.select().from(competitiveProducts).where(eq(competitiveProducts.productId, productId)),
  ]);

  // 2. Plain logic calculations
  const avgWholesale = average(wholesale.map(p => parseFloat(p.price ?? "0")));
  const avgRetail    = average(competitive.map(p => parseFloat(p.price ?? "0")));
  const profitMargin = ((avgRetail - avgWholesale) / avgRetail) * 100;
  const gapScore     = calculateGapScore(avgWholesale, avgRetail, competitive.length);

  // 3. AI analysis via Vercel AI SDK
  const { text: aiSummary } = await generateText({
    model: openai("gpt-4o"),
    prompt: `
      Analyze this dropshipping product opportunity:
      - Avg wholesale price: $${avgWholesale}
      - Avg retail price: $${avgRetail}
      - Profit margin: ${profitMargin.toFixed(1)}%
      - Number of competitors: ${competitive.length}
      - Number of suppliers: ${wholesale.length}
      
      Provide: market gap analysis, opportunity score (1-10), 
      recommendation (strong buy / moderate / avoid), and 3-step marketing strategy.
      Be concise and actionable.
    `,
  });

  // 4. Save report
  await db.insert(productReports).values({
    productId,
    avgWholesalePrice: avgWholesale.toFixed(2),
    avgRetailPrice:    avgRetail.toFixed(2),
    profitMargin:      profitMargin.toFixed(2),
    gapScore:          gapScore.toFixed(2),
    competitorCount:   String(competitive.length),
    supplierCount:     String(wholesale.length),
    aiSummary,
  });

  // 5. Mark product as analyzed
  await db.update(products)
    .set({ status: "analyzed" })
    .where(eq(products.id, productId));
}
```

---

## 🔌 RapidAPI Services

```ts
// server/services/rapidapi/client.ts
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;

export async function rapidFetch(url: string, host: string) {
  const res = await fetch(url, {
    headers: {
      "X-RapidAPI-Key":  RAPIDAPI_KEY,
      "X-RapidAPI-Host": host,
    },
    next: { revalidate: 0 },   // never cache API calls
  });
  if (!res.ok) throw new Error(`RapidAPI error: ${res.status}`);
  return res.json();
}
```

```ts
// server/services/rapidapi/trends.service.ts
export const trendsService = {
  async getInterestAndRising(keyword: string, location: string) {
    const data = await rapidFetch(
      `https://google-trends8.p.rapidapi.com/interest?keyword=${encodeURIComponent(keyword)}&country=${location}`,
      "google-trends8.p.rapidapi.com"
    );
    return {
      score:         data.averageScore ?? "0",
      direction:     data.trend ?? "stable",
      risingQueries: data.risingQueries ?? [],
      trendData:     data,
    };
  }
};
```

```ts
// server/services/rapidapi/aliexpress.service.ts
export const aliExpressService = {
  async searchProducts(keyword: string, filters: SearchFilters) {
    const params = new URLSearchParams({
      keyword,
      ship_to:   filters.location,
      min_price: filters.minPrice ?? "",
      max_price: filters.maxPrice ?? "",
    });
    return rapidFetch(
      `https://aliexpress-datahub.p.rapidapi.com/item_search?${params}`,
      "aliexpress-datahub.p.rapidapi.com"
    );
  }
};
```

---

## 🔄 Page Data Flow Summary

```
/dashboard/finder
  └── Server Action: runProductSearch()
        ├── Trends API     → refined keyword
        ├── AliExpress API → wholesale data
        ├── CJ API         → wholesale data
        ├── Google Shopping → competitive data
        ├── Amazon API     → competitive data
        └── eBay API       → competitive data
              ↓
        All saved to Supabase → redirect to /dashboard/results?productId=xxx

/dashboard/results
  └── Server Component reads from Supabase (no API calls)
        ├── Trend section
        ├── Wholesale products + suppliers
        └── Competitive products + sellers
              ↓
        User clicks "Save & Analyze"
              ↓
        Server Action: runAnalysis() → runs async
        redirect → /dashboard/product/[id]

/dashboard/product/[id]
  └── Server Component reads from Supabase
        ├── Left panel:  wholesaleProducts + wholesaleSuppliers
        └── Right panel: competitiveProducts + competitiveSellers
              ↓
        "View Report" → /dashboard/product/[id]/report

/dashboard/product/[id]/report
  └── Server Component reads productReports from Supabase
        ├── Margin charts
        ├── Gap analysis
        └── AI summary + marketing strategy

/dashboard/suppliers
  └── Server Component queries wholesaleSuppliers table directly

/dashboard/saved
  └── Server Component queries savedProducts joined with products table
```

---

## 🌐 Environment Variables

```bash
# .env.local
RAPIDAPI_KEY=your_key_here
CJ_API_KEY=your_cj_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_postgres_url
```

---

This gives you a clean, typed, server-first architecture with zero over-fetching. Want me to now generate the actual Drizzle migration file and the full `finder.actions.ts` with all normalizers?