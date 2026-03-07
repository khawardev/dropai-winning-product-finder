# Google Trends API Documentation

The Google Trends API allows you to scrape real-time data from the Google Trends search page. You can access it via a `GET` request to the following endpoint:
`https://serpapi.com/search?engine=google_trends`

---

## 🛠️ API Parameters

### **Search Query**

* **`q`** (Required): Defines the query or queries (up to 5 for `TIMESERIES` and `GEO_MAP`). Separate multiple queries with a comma. Can be a "Search term" (e.g., `iPhone`) or an encoded "Topic" (e.g., `/m/0663v`).

### **Geographic Location**

* **`hl`** (Optional): Two-letter language code (e.g., `en`, `es`).
* **`geo`** (Optional): Origin country code. Defaults to `Worldwide`.
* **`region`** (Optional): Specificity for regional charts (`COUNTRY`, `REGION`, `DMA`, or `CITY`).

### **Search Type**

* **`data_type`** (Optional):
* `TIMESERIES`: Interest over time (Default).
* `GEO_MAP`: Compared breakdown by region (Multiple queries only).
* `GEO_MAP_0`: Interest by region (Single query only).
* `RELATED_TOPICS`: Related topics.
* `RELATED_QUERIES`: Related queries.



### **Advanced Parameters**

* **`tz`** (Optional): Time zone offset in minutes (e.g., `420` for PDT). Range: `-1439` to `1439`.
* **`cat`** (Optional): Search category ID (e.g., `319` for Cartoons).
* **`gprop`** (Optional): Filter by property (`images`, `news`, `froogle` for Shopping, or `youtube`).
* **`date`** (Optional): Time range (e.g., `now 7-d`, `today 12-m`, `all`, or custom `yyyy-mm-dd`).
* **`csv`** (Optional): Set to `true` to retrieve results as an array.
* **`include_low_search_volume`** (Optional): Set to `true` to include regions with lower data volume in `GEO_MAP` searches.

---

## 📊 API Results

### **JSON Results**

Includes structured data based on the `data_type` requested.

* **Status**: Check `search_metadata.status` (`Success` or `Error`).
* **Timeline Data**: Found under `interest_over_time.timeline_data`.

### **HTML Results**

SerpApi provides the raw data from Google Trends. Prettified versions can be accessed via `search_metadata.prettify_html_file`.

---

## 💻 Integration Examples

### **Direct URL**

```url
https://serpapi.com/search.json?engine=google_trends&q=quantum+computing&date=today+12-m&tz=420&data_type=TIMESERIES

```

### **Ruby**

```ruby
require "serpapi" 

client = SerpApi::Client.new(
  engine: "google_trends",
  q: "quantum computing",
  date: "today 12-m",
  tz: "420",
  data_type: "TIMESERIES",
  api_key: "YOUR_API_KEY"
)

results = client.search
interest_over_time = results[:interest_over_time]

```

---

## 💡 Key Notes

* **Time Zones**: The `tz` parameter is critical for time-sensitive data (shorter than 7 days). For Tokyo (UTC+9), use `-540`.
* **No Query Search**: You can search by category alone (e.g., `engine=google_trends&cat=319`) without providing a keyword in `q`.

Would you like me to help you create a **Next.js** component to visualize this `TIMESERIES` data using a library like Recharts?