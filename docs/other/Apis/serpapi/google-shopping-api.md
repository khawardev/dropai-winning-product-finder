# Google Shopping API Documentation

The Google Shopping Results API allows you to scrape structured data from Google Shopping search results.

**Endpoint:** `https://serpapi.com/search?engine=google_shopping`
**Method:** `GET`

---

## 🛠️ API Parameters

### **Search Query**

* **`q`** (Required): The search term (e.g., `iPhone`). Accepts any query used in regular Google Shopping searches.

### **Geographic Location**

* **`location`** (Optional): Defines the search origin (e.g., `Austin, Texas, United States`). Use city-level values for better simulation. Cannot be used with `uule`.
* **`uule`** (Optional): Google's encoded location string.

### **Localization**

* **`google_domain`** (Optional): Defaults to `google.com`.
* **`gl`** (Optional): Two-letter country code (e.g., `us`, `uk`).
* **`hl`** (Optional): Two-letter language code (e.g., `en`, `fr`).

### **Advanced Filters**

* **`shoprs`** (Optional): A token containing metadata for specific filters. Can be joined with `||`.
* **`min_price` / `max_price**` (Optional): Lower and upper bounds for price filtering.
* **`sort_by`** (Optional): `1` (Price: low to high), `2` (Price: high to low).
* **`free_shipping`** (Optional): Set to `true` to filter for free shipping.
* **`on_sale`** (Optional): Set to `true` to filter for items on sale.

### **SerpApi Settings**

* **`engine`** (Required): Must be set to `Shopping Graph`.
* **`device`** (Optional): `desktop` (default), `tablet`, or `mobile`.
* **`api_key`** (Required): Your SerpApi private key.

---

## 📊 API Results

The response returns a structured JSON object. Key fields include:

* **`shopping_results`**: An array of product objects including:
* `title`, `price`, `extracted_price`, `link`.
* `source`: The retailer name (e.g., "Apple", "Walmart").
* `rating` & `reviews`: User feedback data.
* `delivery`: Shipping information.
* `thumbnail`: Product image URL.


* **`filters`**: Available sidebar and carousel filters based on the query.
* **`serpapi_pagination`**: Contains a `next` link to easily retrieve the next page of results.

---

## 💻 Integration Examples

### **Direct URL**

```url
https://serpapi.com/search.json?engine=google_shopping&q=iPhone&location=Austin,+Texas,+United+States

```

### **Ruby Example**

```ruby
require "serpapi" 

client = SerpApi::Client.new(
  engine: "google_shopping",
  q: "iPhone",
  location: "Austin, Texas, United States",
  api_key: "YOUR_API_KEY"
)

results = client.search
shopping_results = results[:shopping_results]

```

---

## 💡 Key Features

* **Immersive Product Data**: Includes `serpapi_immersive_product_api` links to fetch deeper product details.
* **Installment Info**: Automatically extracts monthly payment plans where available.
* **Condition Tracking**: Identifies if a product is "New", "Used", or "Refurbished".

Would you like me to generate the **TypeScript interfaces** for the `shopping_results` array so you can integrate this into your Next.js project?