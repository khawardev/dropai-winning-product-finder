# Shop by Shopify Product Search Scraper

Search products across **ALL** Shopify stores with one keyword. No store URL needed. Enter a search term and get structured product data from thousands of Shopify shops, including pricing, variants, reviews, ratings, images, and seller info.

* **1,000 products in under 60 seconds**
* **38 fields per product** · Richest Shopify product output on Apify
* **Shopify Scrapers** ➤ [Store Lead Scraper](https://www.google.com/search?q=https://apify.com/clearpath/shopify-store-leads-scraper)

---

## Quick start

### Minimal input — just a search term:

```json
{
    "query": "wireless headphones"
}

```

### With filters:

```json
{
    "query": "yoga mat",
    "maxItems": 500,
    "sortBy": "price_low_to_high",
    "priceMin": 20,
    "priceMax": 80,
    "inStock": true,
    "category": "gid://shopify/ProductCategory/6"
}

```

---

## Input parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `query` | string | *(required)* | Product search term |
| `category` | string | — | Product category filter (see below) |
| `maxItems` | integer | 100 | Maximum products to scrape (1–50,000) |
| `sortBy` | string | relevance | Sort order: `relevance`, `most_recent`, `price_low_to_high`, `price_high_to_low` |
| `priceMin` | integer | — | Minimum price filter |
| `priceMax` | integer | — | Maximum price filter |
| `onSale` | boolean | false | Only products currently on sale |
| `inStock` | boolean | false | Only products in stock |
| `shipsFrom` | boolean | false | Only local sellers (based on your location) |
| `shipsTo` | string | — | Ships to country filter (57 countries available in dropdown) |

**Categories:** All categories, Women, Men, Accessories, Beauty, Home, Electronics, Luggage & bags, Toys & games, Pet supplies, Fitness & nutrition, Baby & toddler, Food & drinks, Sporting goods, Arts & crafts, plus Women subcategories (Shirts & tops, Pants, Dresses, Intimates, Coats & jackets, Swimwear, Activewear, Shorts, Jumpsuits & rompers, Skirts, Socks & hosiery, Sleepwear & loungewear, Shoes).

---

## Output example

Each product in the dataset looks like this:

```json
{
    "id": "4622421786755",
    "title": "Floating Diamond Necklace",
    "slug": "floating-diamond-necklace",
    "url": "https://www.gorjana.com/products/floating-diamond-necklace",
    "shareUrl": "https://shop.app/p/4622421786755?utm_source=shop_app",
    "description": "The Floating Diamond Necklace is a versatile necklace that adds a touch of elegance to any look...",
    "descriptionHtml": "<p>The Floating Diamond Necklace is a versatile necklace that adds a touch of elegance...</p>",
    "vendor": "Fine",
    "productType": "Necklaces",
    "availableForSale": true,
    "price": 535.0,
    "currency": "USD",
    "originalPrice": null,
    "onSale": false,
    "variantsCount": 2,
    "options": [
        {
            "name": "Metal",
            "values": ["18k Solid Gold", "18k Solid White Gold"]
        }
    ],
    "variants": [
        {
            "id": "gid://shopify/ProductVariant/32537377636483",
            "title": "18k Solid Gold",
            "slug": "18k-solid-gold",
            "availableForSale": true,
            "quantityAvailable": null,
            "requiresShipping": true,
            "price": 535.0,
            "compareAtPrice": null,
            "currency": "USD",
            "selectedOptions": [
                {
                    "name": "Metal",
                    "value": "18k Solid Gold"
                }
            ],
            "imageUrl": "https://cdn.shopify.com/s/files/1/0015/3849/0427/products/204-117-185-G_1.jpg?v=1680782141"
        },
        {
            "id": "gid://shopify/ProductVariant/43316398948483",
            "title": "18k Solid White Gold",
            "slug": "18k-solid-white-gold",
            "availableForSale": true,
            "quantityAvailable": null,
            "requiresShipping": true,
            "price": 535.0,
            "compareAtPrice": null,
            "currency": "USD",
            "selectedOptions": [
                {
                    "name": "Metal",
                    "value": "18k Solid White Gold"
                }
            ],
            "imageUrl": "https://cdn.shopify.com/s/files/1/0015/3849/0427/files/OCT23-PRO-204-117-185-WG-01.jpg?v=1740774415"
        }
    ],
    "images": [
        "https://cdn.shopify.com/s/files/1/0015/3849/0427/products/204-117-185-G_1.jpg?v=1680782141",
        "https://cdn.shopify.com/s/files/1/0015/3849/0427/files/204-117-185-G_03.jpg?v=1696262088"
    ],
    "media": [
        {
            "type": "image",
            "url": "https://cdn.shopify.com/s/files/1/0015/3849/0427/products/204-117-185-G_1.jpg?v=1680782141",
            "altText": "Floating Diamond Necklace || option::18k Solid Gold",
            "width": 1500,
            "height": 1875
        },
        {
            "type": "video",
            "previewUrl": "https://cdn.shopify.com/s/files/1/0015/3849/0427/files/preview_images/37e7de3a51f8438f988ee0dba9a6e4d0.thumbnail.0000000000.jpg?v=1700678859",
            "altText": "Floating Diamond Necklace || option::18k Solid Gold",
            "sources": [
                {
                    "url": "https://proxy.shopifycdn.com/.../37e7de3a51f8438f988ee0dba9a6e4d0.HD-1080p-7.2Mbps.mp4",
                    "mimeType": "video/mp4",
                    "width": 864,
                    "height": 1080,
                    "format": "mp4"
                }
            ]
        }
    ],
    "rating": 4.7925,
    "totalRatings": 53,
    "totalReviews": 17,
    "ratingBreakdown": {
        "oneStar": 0,
        "twoStars": 2,
        "threeStars": 1,
        "fourStars": 3,
        "fiveStars": 47
    },
    "reviews": [
        {
            "id": "256038541",
            "title": null,
            "body": "So pretty and shiny and very delicate. Ive layered with 2 other necklaces. Very happy with my purchase!",
            "rating": 5,
            "helpfulnessCount": 0,
            "submittedAt": "2025-12-09T21:00:59Z",
            "syndicated": false,
            "reviewerName": "Lindsey",
            "merchantReply": null
        },
        {
            "id": "191577022",
            "title": null,
            "body": "Customer service has been great. Sadly, this necklace is way underwhelming. Picture makes diamond look more substantial. Almost non~existent! No complaints with company.",
            "rating": 2,
            "helpfulnessCount": 0,
            "submittedAt": "2025-03-10T23:33:08Z",
            "syndicated": false,
            "reviewerName": "Tiffany",
            "merchantReply": null
        }
    ],
    "shopId": "14671",
    "shopName": "gorjana",
    "shopUrl": "https://www.gorjana.com?utm_source=shop_app",
    "shopMyshopifyDomain": "gorjana.myshopify.com",
    "shopShareUrl": "https://shop.app/m/gorjana?utm_source=shop_app",
    "shopRating": 4.8028,
    "shopTotalRatings": 15081,
    "shopTotalReviews": 3995,
    "shopAddress": [
        "3275 Laguna Canyon Rd Ste R1",
        "Laguna Beach California 92651",
        "United States"
    ],
    "shopContacts": [
        { "method": "web", "target": "https://www.gorjana.com?utm_source=shop_app" },
        { "method": "facebook", "target": "https://www.facebook.com/gorjanabrand/" },
        { "method": "instagram", "target": "https://www.instagram.com/gorjana/" },
        { "method": "pinterest", "target": "https://www.pinterest.com/gorjanabrand/" },
        { "method": "youtube", "target": "https://www.youtube.com/@gorjanabrand" },
        { "method": "email", "target": "customercare@gorjana.com" },
        { "method": "phone", "target": "866-829-0030" }
    ],
    "soldLast30Days": 75,
    "shopCount": 1,
    "universalProductId": "2e599b05-2be5-4c03-8c46-ac6159b710bd",
    "scrapedAt": "2026-03-04T05:39:59.285537+00:00"
}

```

---

## Pricing

Pay per result, no monthly fees. Cost scales with your Apify subscription tier:

| Tier | Per 1,000 products | Per product |
| --- | --- | --- |
| **Regular** | $2.49 | $0.00249 |
| **Bronze** | $2.29 | $0.00229 |
| **Silver** | $1.99 | $0.00199 |
| **Gold** | $1.79 | $0.00179 |

### Cost examples (Regular tier):

* **100 products:** $0.25
* **1,000 products:** $2.49
* **10,000 products:** $24.90

---

## How to scrape Shopify products

1. **Enter a search query** — type any product keyword (e.g. "yoga mat", "wireless earbuds")
2. **Run the scraper** — optionally add price filters, category, sort order, or stock/sale filters
3. **Download your data** — export as JSON, CSV, Excel, or connect via API

### Python integration

```python
from apify_client import ApifyClient

client = ApifyClient("YOUR_API_TOKEN")

run = client.actor("clearpath/shop-by-shopify-product-scraper").call(
    run_input={"query": "wireless headphones", "maxItems": 100}
)

for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(f"{item['title']} — ${item['price']} ({item['shopName']})")

```

### JavaScript integration

```javascript
import { ApifyClient } from "apify-client";

const client = new ApifyClient({ token: "YOUR_API_TOKEN" });

const run = await client
    .actor("clearpath/shop-by-shopify-product-scraper")
    .call({ query: "wireless headphones", maxItems: 100 });

const { items } = await client
    .dataset(run.defaultDatasetId)
    .listItems();

items.forEach((item) => {
    console.log(`${item.title} — $${item.price} (${item.shopName})`);
});

```

---

## Use cases

* **E-commerce research** — Find trending products, discover new suppliers, and analyze what sells across Shopify's entire ecosystem.
* **Competitor analysis** — Track competitor pricing, product ranges, and customer sentiment across multiple Shopify stores simultaneously.
* **Price monitoring** — Compare prices for the same product across different sellers. Spot sale patterns and pricing strategies.
* **Market research** — Aggregate review data, rating distributions, and sales volumes to validate product ideas before launch.

---

## FAQ

**How many products can I scrape?** Up to 50,000 products per run. The scraper processes roughly 1,000 products per minute.

**Do I need a Shopify store URL?** No. This scraper searches across all Shopify stores at once through the Shop app marketplace. Just enter a keyword.

**What product categories are available?** 15 top-level categories (Women, Men, Accessories, Beauty, Home, Electronics, and more) plus 13 Women subcategories. See the full list in the **input parameters** section.

**Can I filter by price range?** Yes. Set `priceMin` and `priceMax` to narrow results to a specific price range. Combine with `onSale: true` to find discounted products only.

**Does it include customer reviews?** Yes. Each product includes individual reviews with reviewer name, rating, title, body text, date, and helpfulness count, plus an aggregate rating breakdown (1-5 stars).

**What shop data is included?** Each product includes the seller's shop name, URL, Myshopify domain, overall rating, total review count, contact channels (web, social media), and physical address when available.

**Can I export the data?** Yes. Download as JSON, CSV, Excel, XML, or HTML directly from Apify Console. You can also access results programmatically via the Apify API or integrate with tools like Google Sheets, Zapier, Make, or Airbyte.

**Is the data real-time?** Each run fetches live data from Shopify's Shop app. Results reflect current pricing, stock status, and reviews at the time of scraping.

---

## Support

* **Bug reports and feature requests:** Open an issue on the actor's **Issues tab**
* **Questions:** Message the developer through Apify Console

## Legal

This actor accesses publicly available data from the Shop by Shopify marketplace. Use responsibly and in accordance with applicable laws and Shopify's terms of service. The developer is not responsible for how scraped data is used.
