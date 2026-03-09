## Your Dropshipping Research Workflow — API Mapping

### Step 1: Identify Product Trends
**✅ Best Fit: Google Trends — `data_type=RELATED_QUERIES`**

This is a great choice. Use the **rising** array — those with "Breakout" or high `extracted_value` are products gaining rapid attention. That's exactly what you need for trend discovery.

```
engine=google_trends&q=your_niche&data_type=RELATED_QUERIES&date=today 3-m
```

Start broad (e.g., `q=home gadgets`) and let the rising queries surface specific trending products.

---

### Step 2: Discover Products on Wholesale Markets
**⚠️ I Disagree With Your Approach Here**

You proposed using `site:aliexpress.com` / `site:alibaba.com` via the **Google Search API**. I'd push back on this for a few reasons:

- Google indexes only a fraction of AliExpress/Alibaba listings, and the results are inconsistent
- You'll get blog posts, review pages, and random indexed pages — not clean product data
- The `local_results` and `local_map` blocks in that Google Search response you shared are completely irrelevant noise for your use case

**Better Fit: Google Shopping API (`engine=google_shopping`) or Google Shopping Light API**

Search like: `q=product_name wholesale` or `q=product_name supplier bulk`

This gives you structured product data: price, source, rating, reviews, and delivery — all parseable. The **Light API** is faster and cheaper if you're doing bulk lookups.

For supplier discovery specifically, Google Shopping will surface sellers from Alibaba, DHgate, etc. naturally.

---

### Step 3: Collect Supplier Information
**✅ Good secondary use: Google Shopping API + Google Immersive Product API**

From the Shopping results, each item has a `serpapi_immersive_product_api` link. Follow that to get:
- Multiple seller listings for the same product
- Pricing per seller
- Shipping terms

This is your supplier comparison layer.

---

### Step 4: Analyze the Competitive Market
**⚠️ I Disagree With Your Approach Here Too**

You proposed **Google Related Brands API** for finding competing stores. That's not the right tool — Related Brands shows brand discovery widgets, not competing sellers for a specific product. It's meant for brand exploration, not competitive pricing analysis.

**Better Fit: Google Shopping API** (same engine, different query intent)

Search the product name without "wholesale/bulk" qualifiers. The results will show you what Shopify stores, Amazon sellers, and retailers are charging. That's your competitive market data.

Also consider: **Google Inline Shopping API** — these are the shopping cards that appear in regular Google Search. They often surface Shopify dropshippers directly, which is exactly who you're competing against.

```
engine=google&q=product_name
→ extract shopping_results block (inline shopping)
```

---

### Step 5: Collect Seller & Pricing Data
**✅ Best Fit: Google Shopping API + Google Product Result API**

`Google Product Result API` is underrated for this step. When you search a specific product (e.g., `q=dyson v8`), you get a structured `pricing` array with:
- Multiple sellers
- Original vs. current price
- Availability + delivery

This is clean, structured pricing data perfect for your profit analysis.

---

### Step 6: Gap & Profit Analysis
This is **your app logic**, not an API call. You take:
- Wholesale price (from Step 2)
- Retail/competitive price (from Steps 4–5)
- Calculate margin

No SerpAPI needed here — just your backend math.

---

## Clean Summary Table

| Your Workflow Step | Recommended API | Engine |
|---|---|---|
| 1. Trend Discovery | Google Trends Related Queries | `google_trends` + `RELATED_QUERIES` |
| 2. Wholesale Product Search | Google Shopping / Shopping Light | `google_shopping` or `google_shopping_light` |
| 3. Supplier Details | Google Immersive Product API | Follow `serpapi_immersive_product_api` links |
| 4. Competitive Market | Google Inline Shopping (via Google Search) | `engine=google` → `shopping_results` block |
| 5. Pricing Data | Google Product Result API | `engine=google` device=mobile for product panel |
| 6. Profit Analysis | Your own logic | — |

---

## One Important Caution

SerpAPI credits add up fast if you're chaining 4–5 API calls per product research session. In your Next.js app, I'd recommend:
1. Cache trend results (they don't change hourly)
2. Only call the Immersive Product API on-demand (not for every result)
3. Use **Shopping Light** for bulk scanning, **Shopping** only when you need full detail

Want me to sketch out the actual Next.js API route structure for this workflow?