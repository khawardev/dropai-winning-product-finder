This is a highly robust and well-thought-out architecture. By standardizing your external data through RapidAPI and leveraging Next.js App Router with Server Actions and Supabase, you are setting up a highly scalable, low-latency foundation.

Here is your raw outline transformed into a **Structured Project-Level Master Prompt / PRD (Product Requirements Document)**. You can feed this directly into an AI coding assistant (like Cursor, GitHub Copilot, or standard Gemini/ChatGPT) to establish the context, rules, and architecture for your entire codebase.

---

# 📋 System Prompt & Project Architecture: Dropshipping Intelligence Platform

## 1. Project Overview

This project is an advanced B2B SaaS platform for dropshippers. It automates product research by aggregating trend data, wholesale supplier metrics, and competitive market pricing to identify profitable gaps.

## 2. Technology Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Data Fetching:** Server Components (default), Server Actions (`/server/actions`) for mutations, SWR for client-side fetching/polling where real-time UI updates are required.
* **Database:** Supabase (PostgreSQL)
* **ORM:** Drizzle ORM (`/server/db/schema.ts`, `/server/db/migrations/`)
* **AI Integration:** Vercel AI SDK with OpenAI (for market gap and profit analysis)
* **API Hub:** RapidAPI (Single integration point for all external data)

---

## 3. Data Integration Strategy: The RapidAPI Hub

To avoid managing multiple vendor accounts and complex billing, **RapidAPI** acts as the single hub for all external data aggregation.

| Data Requirement | Assigned RapidAPI Product | Purpose |
| --- | --- | --- |
| **Trend Signals** | Google Trends API | Validate demand and current market interest. |
| **Wholesale Data** | AliExpress Data API | Extract wholesale products, supplier info, and pricing. |
| **Competitor Data** | Amazon Data API / eBay API | Pull competitor pricing and listing details. |
| **Market Prices** | Google Shopping API | Determine average consumer selling prices. |

**Standardized Fetch Pattern:**
All data requests to external services will utilize the same Next.js server-side `fetch` pattern using a single API key:

```typescript
const response = await fetch(endpoint, {
  headers: {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": "specific-api-host.p.rapidapi.com"
  }
});

```

---

## 4. Application Routing & UI Architecture

| Route | View Name | Core User Function |
| --- | --- | --- |
| `/dashboard` | Overview | Bird's-eye view. Top-level metrics (potential revenue), global trends tracking, and quick access to recent winning products. |
| `/dashboard/finder` | Product Finder | Input form (niche, country, price range, shipping) to deploy the search algorithm for profitable products. |
| `/dashboard/results` | Search Results | Transforms raw JSON from RapidAPI into a clean UI showing: 1) Trend data, 2) Wholesale products & suppliers, 3) Competitive products & sellers. Contains the **"Save & Analyze"** trigger. |
| `/dashboard/saved` | Vault | Personal library to browse, search, and organize high-potential bookmarked products. |
| `/dashboard/product/[id]` | Split Deep-Dive | Side-by-side evaluation view. **Left:** Wholesale products & suppliers. **Right:** Competitive products & sellers. |
| `/dashboard/product/[id]/report` | AI Analysis | Shows processed data, AI-identified market gaps, business opportunities, profit margin estimations, and raw data comparison. |
| `/dashboard/suppliers` | Supplier Library | Searchable/filterable database of saved wholesale and competitive suppliers (shipping times, reliability, costs). |
| `/dashboard/reports` | Market Reports | Macro-level research. Visual charts comparing niche trends over time, profit margin distributions, and CSV exports. |
| `/dashboard/settings` | Settings | Profile management, Pro subscription ($79/mo) handling, API key generation, and email alerts. |

---

## 5. Core Business Logic: The Research Workflow

The backend data pipeline executes chronologically when a user initiates a search:

1. **Identify Trends:** Query Google Trends API to validate search terms and identify specific booming variants.
2. **Wholesale Discovery:** Search trending items on wholesale marketplaces (AliExpress, Alibaba, CJ Dropshipping via RapidAPI).
3. **Supplier Extraction:** Isolate and map detailed supplier metrics (rating, shipping time, wholesale cost) from the wholesale data.
4. **Competitive Discovery:** Search the exact same product on consumer platforms (Shopify stores, Google Shopping, Amazon via RapidAPI).
5. **Seller Extraction:** Isolate competitor metrics (selling price, seller authority).
6. **Gap Analysis:** Compare wholesale costs vs. market selling prices to calculate margins and pinpoint market gaps.

---

## 6. System Execution Example: "Sony Headphone"

**Phase 1: The Search (`/dashboard/finder`)**

* User inputs: "Sony Headphone", Location: US, Price Range: $20-$50.
* System triggers Next.js Server Actions to poll RapidAPI endpoints.

**Phase 2: Data Aggregation (`/dashboard/results`)**

* UI displays parsed data arrays: Trend graphs, list of wholesale suppliers, list of current consumer sellers.
* User reviews the raw data and clicks **"Save & Analyze"**.

**Phase 3: Database Mutation & AI Trigger (Server Actions + Drizzle ORM)**

* System writes to Supabase:
* Creates a unified `Product` record.
* Saves `Wholesale Suppliers` and `Competitive Sellers` as distinct relational records linked to the Product (populating `/dashboard/suppliers`).


* System triggers Vercel AI SDK: Prompts OpenAI with the raw pricing and supplier data to generate a structured Profit Margin and Gap Analysis report.

**Phase 4: The Evaluation (`/dashboard/product/[id]`)**

* User visits the generated product ID.
* UI renders a split-screen Server Component: Wholesale data on the left, Competitor data on the right.
* User navigates to `/dashboard/product/[id]/report` to read the AI-generated strategy and margin analysis, and decides whether to push the product to their store.

---

### **Instructions for the AI Developer Assistant:**

When writing code for this project, strictly adhere to the stack specified above. Prioritize **Server Components** for read operations and **Server Actions** for writes/mutations. Maintain strict type safety across all RapidAPI JSON responses using TypeScript interfaces before passing data to Drizzle ORM inserts.

---

### Next Step

Would you like me to generate the **Drizzle ORM schema (`schema.ts`)** to perfectly map the relational database structure for Products, Wholesale Suppliers, Competitor Sellers, and AI Reports based on this architecture?