# 🚀 DropAI Backend Implementation Guide

## Executive Summary

DropAI is an AI-powered dropshipping intelligence platform. This guide outlines the backend architecture using **Mastra** (TypeScript AI framework) instead of CrewAI, providing a modern, type-safe alternative for building multi-agent workflows.

---

## 1. System Architecture Overview

### High-Level Data Flow

```mermaid
flowchart TB
    subgraph Frontend["Next.js 14+ Frontend (App Router)"]
        UI["User Interface"]
        SA["Server Actions"]
    end

    subgraph Backend["Next.js Backend Layer"]
        subgraph Auth["Authentication Layer"]
            BA["Better Auth"]
        end
        
        subgraph AI_Engine["Mastra AI Engine"]
            MA["Mastra Orchestrator"]
            subgraph Agents["Agent Swarm"]
                A1["TrendSpotter Agent"]
                A2["SupplierHunter Agent"]
                A3["ProfitAnalyst Agent"]
            end
            WF["Workflow Engine"]
            MEM["Agent Memory"]
        end
        
        subgraph Data_Layer["Data Layer"]
            DR["Drizzle ORM"]
            SB["Supabase PostgreSQL"]
        end
        
        subgraph External["External APIs"]
            API1["Google Trends API"]
            API2["Apify Scrapers"]
            API3["AliExpress API"]
            API4["Social Media APIs"]
        end
    end

    UI -->|"User Request (Niche, Country, Budget)"| SA
    SA -->|"Validate (Zod)"| BA
    BA -->|"Check Cache"| DR
    DR -->|"Query"| SB
    
    SB -->|"Cache Hit?"| SA
    SA -->|"Cache Miss: Trigger AI"| MA
    
    MA -->|"Orchestrate"| WF
    WF -->|"Step 1: Find Trends"| A1
    A1 -->|"Search APIs"| API1
    A1 -->|"Scrape Social"| API4
    
    A1 -->|"Product Candidates"| A2
    A2 -->|"Source Products"| API2
    A2 -->|"Check Suppliers"| API3
    
    A2 -->|"Supplier Data"| A3
    A3 -->|"Calculate Margins"| API2
    A3 -->|"Final Analysis"| MA
    
    MA -->|"Store Results"| DR
    DR -->|"Persist"| SB
    MA -->|"Return JSON"| SA
    SA -->|"Display"| UI
    
    style AI_Engine fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style Backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
```

### Why This Architecture?

| Component | Purpose | Benefit |
|-----------|---------|---------|
| **Next.js App Router** | Full-stack framework | Unified frontend/backend, Server Actions, streaming |
| **Mastra** | AI orchestration | TypeScript-native, Vercel AI SDK integration, durable workflows |
| **Supabase + Drizzle** | Database | Type-safe SQL, PostgreSQL power, real-time subscriptions |
| **Better Auth** | Authentication | Framework-agnostic, lightweight, secure |
| **Server Actions** | API layer | No separate REST API needed, automatic type safety |
| **Zod** | Validation | Runtime type safety, perfect for AI output parsing |

---

## 2. Feature Roadmap & Implementation Logic

### 2.1 Core Feature: AI Product Discovery Workflow

This is the heart of DropAI. Here's how the **Mastra-powered** multi-agent system works:

#### Step-by-Step Workflow

```mermaid
sequenceDiagram
    actor Sarah as Sarah (User)
    participant UI as Next.js Frontend
    participant SA as Server Action
    participant DB as Supabase
    participant MA as Mastra Orchestrator
    participant A1 as TrendSpotter Agent
    participant A2 as SupplierHunter Agent
    participant A3 as ProfitAnalyst Agent
    
    Sarah->>UI: Enter: "Dogs", "USA", "$10 Budget"
    UI->>SA: submitProductSearch(formData)
    
    SA->>DB: Check cache (last 24h?)
    
    alt Cache Hit
        DB-->>SA: Return cached results
        SA-->>UI: Display products instantly
    else Cache Miss
        SA->>MA: triggerProductDiscoveryWorkflow(input)
        
        Note over MA: Workflow Step 1: TREND DETECTION
        
        MA->>A1: execute(input: {niche: "Dogs", country: "USA"})
        A1->>A1: Call Google Trends API
        A1->>A1: Scrape TikTok/Instagram hashtags
        A1->>A1: Analyze trending products
        
        A1-->>MA: Return: ["Portable Dog Water Bottle", "Smart Pet Feeder"]
        
        Note over MA: Workflow Step 2: SUPPLIER SOURCING
        
        MA->>A2: execute(products: [...])
        A2->>A2: Query AliExpress API
        A2->>A2: Check shipping times to USA
        A2->>A2: Verify supplier ratings
        
        A2-->>MA: Return: [{product, suppliers: [{name, cost, shipping, rating}]}]
        
        Note over MA: Workflow Step 3: PROFIT ANALYSIS
        
        MA->>A3: execute(supplierData: [...])
        A3->>A3: Scrape competitor prices (Shopify stores)
        A3->>A3: Calculate profit margins
        A3->>A3: Assess competition level
        
        A3-->>MA: Return: [{product, profit, demandScore, competition}]
        
        MA->>MA: Aggregate & structure final JSON
        MA->>DB: Save results with timestamp
        MA-->>SA: Return structured product analysis
        SA-->>UI: Display winning products
    end
    
    Sarah->>UI: Click "Save Product"
    UI->>SA: saveToCollection(productId)
    SA->>DB: Insert into user_saved_products
```

#### How Mastra Replaces CrewAI

Instead of Python-based CrewAI, we use **Mastra's TypeScript-native** approach:

| CrewAI Concept | Mastra Equivalent | Implementation |
|----------------|-------------------|----------------|
| **Crew** | **Workflow Engine** | `mastra.workflow()` with `.step()` chaining |
| **Agent** | **Agent** | `mastra.agent()` with tools and instructions |
| **Task** | **Step** | Individual workflow steps with input/output schemas |
| **Process** | **Orchestration** | Sequential, parallel, or conditional branching |

---

### 2.2 Feature: Supplier Intelligence System

```mermaid
flowchart LR
    subgraph DataCollection["Data Collection Layer"]
        A[AliExpress API] -->|Product Cost| D[(Supabase)]
        B[Apify Scrapers] -->|Supplier Ratings| D
        C[Manual Reviews] -->|Quality Score| D
    end
    
    subgraph Processing["Mastra Processing"]
        D -->|Raw Data| E[Supplier Analyst Agent]
        E -->|Calculate| F[Reliability Score 0-100]
        E -->|Determine| G[Shipping Speed Badge]
        E -->|Flag| H[Verified Status]
    end
    
    subgraph API["Server Action API"]
        F -->|GET| I[getSuppliersByCategory]
        G -->|GET| J[getFastShippingSuppliers]
        H -->|POST| K[verifySupplier]
    end
    
    subgraph Frontend["UI Components"]
        I -->|Render| L[Supplier Directory Table]
        J -->|Filter| M[Shipping Filter]
        K -->|Update| N[Verification Badge]
    end
    
    style Processing fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
```

---

### 2.3 Feature: Market Intelligence & Reporting

```mermaid
flowchart TB
    subgraph ScheduledJobs["Scheduled Tasks (Vercel Cron)"]
        Cron["Daily at 2 AM"] -->|Trigger| MA2[Mastra Workflow]
    end
    
    subgraph Analysis["Market Analysis Agents"]
        MA2 -->|Step 1| T1[Trend Aggregator]
        MA2 -->|Step 2| T2[Category Performance Analyzer]
        MA2 -->|Step 3| T3[Profit Distribution Calculator]
    end
    
    subgraph DataSources["External Data"]
        T1 -->|Fetch| G1[Google Trends API]
        T2 -->|Scrape| A1[Apify - Amazon Best Sellers]
        T3 -->|Query| DB1[Internal Sales DB]
    end
    
    subgraph Storage["Data Storage"]
        T1 -->|Store| S1[Niche Trends Table]
        T2 -->|Store| S2[Category Metrics Table]
        T3 -->|Store| S3[Profit Analytics Table]
    end
    
    subgraph Visualization["Frontend Visualization"]
        S1 -->|API| V1[Recharts - Trend Lines]
        S2 -->|API| V2[Recharts - Performance Bars]
        S3 -->|API| V3[Recharts - Profit Pie Chart]
    end
    
    style ScheduledJobs fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
```

---

## 3. API Strategy & Third-Party Integrations

### 3.1 Primary Data Sources

#### **A. Google Trends API (Official)**
- **URL**: [https://developers.google.com/trends](https://developers.google.com/trends) 
- **Status**: Alpha (limited access, approval required) 
- **Purpose**: Validate product demand using real search volume data

**How It Works in DropAI:**
1. **User Input**: Sarah searches for "Dogs" niche
2. **Backend Call**: TrendSpotter Agent calls Google Trends API with parameters:
   - `keyword`: "portable dog water bottle"
   - `geo`: "US"
   - `timeframe`: "today 1-m"
3. **What It Returns**: Interest over time (0-100 scale), related queries, trending topics
4. **Processing**: Mastra agent converts relative interest to demand score (0-100)
5. **User Benefit**: Sarah sees "Demand Score: 85/100 (Trending Upward)"

**Fallback Strategy**: If official API is unavailable, use **Glimpse API**  or **ScrapingBee**  for unofficial Google Trends data.

---

#### **B. Apify - E-commerce Scraping Tool**
- **URL**: [https://apify.com/apify/e-commerce-scraping-tool](https://apify.com/apify/e-commerce-scraping-tool) 
- **Purpose**: Scrape competitor prices, product details, and supplier information from ANY e-commerce site

**How It Works in DropAI:**
1. **Scenario**: ProfitAnalyst Agent needs to check competitor pricing for "Portable Dog Water Bottle"
2. **Backend Action**: 
   - Agent identifies 5 Shopify stores selling similar products via Google Search
   - Calls Apify API with store URLs
3. **What It Returns**: 
   ```json
   {
     "product": {
       "title": "Portable Dog Water Bottle 500ml",
       "price": "$24.99",
       "currency": "USD",
       "availability": "In Stock"
     },
     "sellers": [...]
   }
   ```
4. **Processing**: Agent calculates average market price ($24.00) vs. wholesale cost ($4.00)
5. **User Benefit**: Sarah sees "Competitors sell at $24.00 | Your potential profit: $20.00 (83% margin)"

**Key Features Used**:
- Proxy rotation (avoid blocks)
- JavaScript rendering (for dynamic Shopify stores)
- Scheduled runs (track price changes over time) 

---

#### **C. AliExpress API (RapidAPI)**
- **URL**: [https://rapidapi.com/category/Shopping](https://rapidapi.com/category/Shopping) (Search for AliExpress APIs)
- **Purpose**: Real-time supplier data, pricing, and shipping information

**How It Works in DropAI:**
1. **Scenario**: SupplierHunter Agent needs to source "Portable Dog Water Bottle"
2. **Backend Action**:
   - Calls AliExpress API with search term
   - Filters by: price <$10, shipping to USA, rating >4.5
3. **What It Returns**:
   ```json
   {
     "product_id": "12345",
     "title": "500ml Portable Pet Water Bottle",
     "price": 3.99,
     "shipping_cost": 2.50,
     "shipping_days": 7,
     "supplier_rating": 4.8,
     "supplier_name": "PetGadgets Store",
     "order_count": 15420
   }
   ```
4. **Processing**: Agent validates supplier reliability, calculates total landed cost
5. **User Benefit**: Sarah sees "3 Suppliers Found | Best Price: $4.00 | Ships in 7 days"

---

#### **D. Social Media Trend APIs (TikTok/Instagram)**
- **TikTok Research API**: [https://developers.tiktok.com/](https://developers.tiktok.com/) (Official, requires approval)
- **Alternative**: **ScrapingBee** or **Apify TikTok Scraper** 

**How It Works in DropAI:**
1. **Scenario**: TrendSpotter Agent checks if "Portable Dog Water Bottle" is viral
2. **Backend Action**:
   - Scrapes TikTok for hashtag #dogaccessories
   - Counts video views, likes, and engagement rate
   - Identifies influencer mentions
3. **What It Returns**: Viral coefficient score, trending hashtags, creator sentiment
4. **Processing**: Agent combines with Google Trends for "Social Proof Score"
5. **User Benefit**: Sarah sees "🔥 Trending on TikTok: 2.5M views this week"

---

### 3.2 API Integration Architecture

```mermaid
flowchart TB
    subgraph MastraAgents["Mastra Agents"]
        direction TB
        A1[TrendSpotter]
        A2[SupplierHunter]
        A3[ProfitAnalyst]
    end
    
    subgraph APILayer["API Integration Layer"]
        direction TB
        T1[Tool: GoogleTrendsTool]
        T2[Tool: ApifyScraperTool]
        T3[Tool: AliExpressTool]
        T4[Tool: SocialMediaTool]
    end
    
    subgraph ExternalAPIs["Third-Party APIs"]
        G1[Google Trends API]
        AY[Apify Platform]
        AL[AliExpress API]
        SM[Social Media Scrapers]
    end
    
    subgraph ErrorHandling["Resilience Layer"]
        R1[Retry Logic]
        R2[Fallback APIs]
        R3[Rate Limiting]
    end
    
    A1 -->|uses| T1
    A1 -->|uses| T4
    A2 -->|uses| T3
    A3 -->|uses| T2
    
    T1 -->|HTTP| G1
    T2 -->|HTTP| AY
    T3 -->|HTTP| AL
    T4 -->|HTTP| SM
    
    G1 -->|Error?| R1
    AY -->|Error?| R2
    AL -->|Rate Limit?| R3
    
    style APILayer fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style ErrorHandling fill:#ffebee,stroke:#c62828,stroke-width:2px
```

---

## 4. Database Schema Design (Drizzle ORM)

### Core Tables

```mermaid
erDiagram
    USER ||--o{ SEARCH_HISTORY : makes
    USER ||--o{ SAVED_PRODUCTS : saves
    SEARCH_HISTORY ||--o{ PRODUCT_RESULTS : generates
    PRODUCT_RESULTS ||--o{ SUPPLIER_LINKS : has
    PRODUCT_RESULTS ||--o{ MARKET_DATA : includes
    
    USER {
        uuid id PK
        string email
        string name
        enum plan "free|pro"
        timestamp created_at
    }
    
    SEARCH_HISTORY {
        uuid id PK
        uuid user_id FK
        string niche
        string target_country
        decimal budget_min
        decimal budget_max
        jsonb parameters
        timestamp created_at
        enum status "pending|processing|completed|failed"
    }
    
    PRODUCT_RESULTS {
        uuid id PK
        uuid search_id FK
        string name
        string description
        decimal demand_score
        decimal profit_margin
        decimal competition_level
        jsonb ai_analysis
        timestamp discovered_at
    }
    
    SUPPLIER_LINKS {
        uuid id PK
        uuid product_id FK
        string supplier_name
        decimal cost_price
        decimal shipping_cost
        int shipping_days
        decimal reliability_score
        string product_url
    }
    
    SAVED_PRODUCTS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        jsonb notes
        timestamp saved_at
    }
    
    MARKET_DATA {
        uuid id PK
        string niche
        date date
        decimal trend_score
        jsonb metadata
    }
```

---

## 5. Implementation Patterns & Code Structure

### 5.1 Project Structure

```
dropai/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (if needed)
│   ├── dashboard/
│   │   ├── finder/
│   │   │   └── page.tsx          # Product finder UI
│   │   └── results/
│   │       └── page.tsx          # Results display
│   └── actions/                  # Server Actions
│       ├── product-search.ts     # Main search action
│       ├── save-product.ts       # Save to collection
│       └── supplier-queries.ts   # Supplier data
├── lib/
│   ├── mastra/                   # AI Engine
│   │   ├── index.ts              # Mastra initialization
│   │   ├── agents/               # Agent definitions
│   │   │   ├── trend-spotter.ts
│   │   │   ├── supplier-hunter.ts
│   │   │   └── profit-analyst.ts
│   │   ├── workflows/            # Workflow definitions
│   │   │   └── product-discovery.ts
│   │   └── tools/                # API tools
│   │       ├── google-trends.ts
│   │       ├── apify-scraper.ts
│   │       └── aliexpress.ts
│   ├── db/                       # Database
│   │   ├── schema.ts             # Drizzle schema
│   │   ├── index.ts              # Connection
│   │   └── queries.ts            # Type-safe queries
│   └── auth.ts                   # Better Auth config
├── types/
│   └── index.ts                  # Shared TypeScript types
└── validations/
    └── schemas.ts                # Zod schemas
```

### 5.2 Mastra Workflow Example (Conceptual)

```typescript
// lib/mastra/workflows/product-discovery.ts

import { mastra } from '../index';
import { z } from 'zod';

// Define workflow input schema
const discoveryInputSchema = z.object({
  niche: z.string(),
  country: z.string(),
  maxBudget: z.number(),
});

export const productDiscoveryWorkflow = mastra.workflow({
  name: 'product-discovery',
  triggerSchema: discoveryInputSchema,
  
  steps: [
    // Step 1: Trend Spotting
    {
      id: 'find-trends',
      execute: async ({ input, agents }) => {
        const trendSpotter = agents.get('trendSpotter');
        const trends = await trendSpotter.execute({
          prompt: `Find trending products in ${input.niche} for ${input.country}`,
        });
        return { productCandidates: trends.products };
      },
    },
    
    // Step 2: Supplier Sourcing (depends on step 1)
    {
      id: 'source-suppliers',
      execute: async ({ input, prevResults, agents }) => {
        const supplierHunter = agents.get('supplierHunter');
        const products = prevResults['find-trends'].productCandidates;
        
        const sourced = await Promise.all(
          products.map(p => supplierHunter.execute({
            prompt: `Find suppliers for ${p.name} under $${input.maxBudget}`,
          }))
        );
        return { sourcedProducts: sourced };
      },
    },
    
    // Step 3: Profit Analysis (depends on step 2)
    {
      id: 'analyze-profit',
      execute: async ({ prevResults, agents }) => {
        const profitAnalyst = agents.get('profitAnalyst');
        const products = prevResults['source-suppliers'].sourcedProducts;
        
        const analysis = await profitAnalyst.execute({
          prompt: `Calculate profit margins and competition for: ${JSON.stringify(products)}`,
        });
        return { finalResults: analysis };
      },
    },
  ],
});
```

---

## 6. Must-Have Tools & Scalability Recommendations

### 6.1 Critical Additions to Your Stack

| Tool/Service | Purpose | Why Essential |
|--------------|---------|---------------|
| **BullMQ** or **Inngest** | Background job processing | Mastra workflows can take 30-60 seconds. Process asynchronously, notify user when done. |
| **Vercel AI SDK** | Streaming UI | Already in your stack. Use for real-time agent status updates ("Scanning trends..."). |
| **Upstash Kafka** or **Vercel Postgres** | Event streaming | Track agent execution events, retry failed steps. |
| **Helicone** or **Langfuse** | AI Observability | Track Mastra agent costs, latency, and success rates. |
| **Resend** | Transactional email | Notify Sarah when her product research is complete. |

### 6.2 Architectural Patterns

#### **Pattern 1: Durable Execution**
Since Mastra workflows involve multiple API calls (potentially 30-60 seconds), use **Vercel's `unstable_after`** or **Inngest** for durable execution:

```mermaid
flowchart LR
    A[User Request] -->|Trigger| B[Server Action]
    B -->|Start Job| C[Inngest Function]
    B -->|Return| D[Job ID to Client]
    C -->|Run Mastra| E[Workflow]
    E -->|Progress| F[Redis/Postgres]
    D -->|Poll| F
    F -->|Complete| G[Notify Client]
```

#### **Pattern 2: Idempotency**
Prevent duplicate AI processing for identical searches:

```typescript
// Server Action pseudo-code
export async function searchProducts(input: SearchInput) {
  // 1. Create hash of input parameters
  const cacheKey = hash(input);
  
  // 2. Check Supabase for recent result (24h)
  const cached = await db.query.searchHistory.findFirst({
    where: eq(searchHistory.cacheKey, cacheKey),
    where: gt(searchHistory.createdAt, new Date(Date.now() - 24*60*60*1000))
  });
  
  if (cached) return cached.results; // Instant return
  
  // 3. Trigger new Mastra workflow
  const job = await inngest.send({
    name: 'product.discovery',
    data: { ...input, cacheKey }
  });
  
  return { jobId: job.id, status: 'processing' };
}
```

#### **Pattern 3: Circuit Breaker**
Protect against API failures (e.g., AliExpress down):

```mermaid
stateDiagram-v2
    [*] --> Closed: Normal Operation
    Closed --> Open: 5 Failures in 60s
    Open --> HalfOpen: After 60s timeout
    HalfOpen --> Closed: Success
    HalfOpen --> Open: Failure
    Open --> [*]: Return Fallback Data
```

### 6.3 Cost Optimization (No Redis Cache)

Since you're not using Redis, implement **application-level caching** in Supabase:

```sql
-- Create a cache table in Supabase
CREATE TABLE api_cache (
  key TEXT PRIMARY KEY,
  data JSONB,
  expires_at TIMESTAMP,
  created_at DEFAULT now()
);

-- Auto-cleanup expired entries
CREATE OR REPLACE FUNCTION cleanup_cache() RETURNS void AS $$
BEGIN
  DELETE FROM api_cache WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;
```

---

## 7. Security & Performance Considerations

### 7.1 Security Checklist

- **API Key Rotation**: Store all API keys in Vercel Environment Variables, rotate monthly
- **Rate Limiting**: Implement per-user rate limits on Server Actions (using `@upstash/ratelimit` or similar)
- **Input Sanitization**: Zod validation on all inputs before Mastra processing
- **SQL Injection Prevention**: Drizzle ORM handles this, but never use raw SQL with user input
- **AI Output Validation**: Validate Mastra agent outputs with Zod before database insertion

### 7.2 Performance Targets

| Metric | Target | Implementation |
|--------|--------|----------------|
| **Cached Search** | <500ms | Supabase query with indexed cache key |
| **New Search Init** | <2s | Async job creation, immediate response |
| **Full AI Workflow** | <60s | Parallel API calls where possible |
| **Dashboard Load** | <1s | Incremental Static Regeneration for reports |

---

## 8. Summary: Why This Architecture Wins

1. **Type Safety End-to-End**: TypeScript from frontend → Mastra agents → Database (Drizzle)
2. **Modern AI Orchestration**: Mastra provides durable workflows, memory, and tracing without Python complexity
3. **Serverless-First**: Runs entirely on Vercel, scales automatically, pay-per-use
4. **No Infrastructure Debt**: No Redis, no Kubernetes, no complex DevOps
5. **Rapid Development**: Server Actions eliminate API boilerplate, Mastra handles AI complexity

This architecture gives Sarah (your user) a magical experience: she enters "Dogs" and gets a complete business intelligence report in under a minute, while you maintain a clean, type-safe, scalable codebase.