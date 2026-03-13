# DropAI Workflow Implementation Guide

## 1. Architecture & Data Flow Overview
The core objective of this restructure is to clean up the architecture and streamline the data flow. The existing scattered product-related schemas will be discarded. Instead, the database will be redesigned so that when a product is marked as a **Winning Product**, the system stores the **complete dataset** across the entire pipeline. 

Each analyzed keyword or product will have a **single consolidated record** (or cleanly linked relations) containing all intelligence gathered:
- Trend Discovery Data
- Competitive Analysis Data
- Paid & Organic Market Intelligence Metrics
- Supplier Product Data
- Profit Margin Calculations

## 2. Phase 1: Trend Discovery

**User Inputs & API Call:**
- **Inputs:** The user searches using a Keyword. **Region** and **Timeframe** will be kept in the UI as they map directly to `geo` and `date` in the SerpApi Google Trends request (`engine: "google_trends"`).
- **Trigger:** Clicking the **"Find Breakout Niches"** button sends a request to a Next.js API route, which in turn calls SerpApi.
- **Data Source:** Referencing `Trends-Api-Response.json`, the payload returns `breakouts`, `rising`, and `top` queries.

**UI Implementation:**
- **Raw Output & Validations:** Trending keywords returned from the API are displayed in a clean, card-based interface.
- Action: Each card features an **"Analyze"** button to advance the workflow to the next stage.

## 3. Phase 2: Competitive Analysis

**Simplified Workflow & UI:**
- **Trigger:** Clicking "Analyze" on a trending keyword card routes the user to the Competitive Analysis page.
- **UI Adjustments:** Keep product cards minimal and clean. **Remove** unnecessary partial actions:
  - Catalog buttons
  - "Find Suppliers"
  - "Save Sellers" on competitive product cards
  - "Save" buttons in Organic Marketplace Stores
  - "Proceed to Supplier Discovery"
- **Action:** Instead of scattered actions, the focus is on a single, unified action to **save the complete competitive product dataset** when a product is selected or marked for deeper analysis.

**Market Intelligence Metrics:**
Using `Competitive-Api-Response.json`:
- **Average Market Price:** Extracted from the `avgPrice` field.
- **Number of Shopping Competitors:** Based on the length of the `competitors` array.
- **Marketplace Stores Spy Count:** Based on the length of the `marketplaceStores` array.
These Paid & Organic Landscape insights must be persisted in the database alongside the core competitive product data.

## 4. Phase 3: Supplier Discovery & Profitability

**Supplier Intelligence:**
- **Data Source:** Referencing `Supplier-Api-Response.json`, supplier products are displayed along with the `lowestPrice`.
- **UI Adjustments:** Remove "Save Wholesalers" buttons on supplier cards to maintain the minimal, unified saving approach.

**Profit Margin Calculator & Analytics:**
The system evaluates supplier pricing against competitive retail pricing to generate actionable calculated metrics:
- **Average Retail Price** (from Competitive Analysis)
- **Lowest Wholesale Price** (from Supplier Discovery)
- **Gross Margin** (Average Retail Price - Lowest Wholesale Price)
- **Margin Percentage** ((Gross Margin / Average Retail Price) * 100)
- **Verdict:** A boolean or status string indicating if the product represents a "Good Opportunity."
These calculated insights form the supplier intelligence layer and must be stored in the database.

## 5. Database Schema Redesign

Remove the old, fragmented product schemas. Create new, centralized schemas (using Drizzle ORM/Supabase per project stack rules) designed specifically to store structured datasets for a **Winning Product**:

1. **Query/Product Record:** The root entity tracking the original search and timestamp.
2. **Trends Data:** Breakout and rising keyword metrics.
3. **Competitive Products:** Array of competitors and their pricing.
4. **Market Intelligence:** The aggregated metrics (Avg Market Price, Competitor Count, Store Count).
5. **Supplier Products:** Sourcing options and wholesale pricing.
6. **Profitability Metrics:** The calculated margins and verdict.

*(All of these can be consolidated into a cleanly related structure where marking a "Winning Product" fires a single Server Action to persist the entire suite of data).*

## 6. Pipeline Dashboard (New Route)

**Inspection & Review:**
Implement a dedicated route or dashboard that allows viewing all stored data associated with a specific query. 

This dashboard serves as the central hub to inspect the **entire intelligence pipeline**:
`Trend Discovery` → `Competitive Analysis` → `Supplier Sourcing` → `Profitability Evaluation`

Users can review all signals, metrics, and products related to a keyword in one consolidated view without having to re-run API calls.
