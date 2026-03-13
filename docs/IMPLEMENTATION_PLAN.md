# DropAI Winning Product Finder - Implementation Plan

## Overview
The goal of this implementation is to simplify the product research workflow and restructure the data persistence layer. Instead of saving fragmented data pieces, the system will capture a complete snapshot of the research pipeline (Trends → Competition → Suppliers → Profitability) into a consolidated "Winning Product" record.

---

## Phase 1: Workflow & UI Simplification

### 1. Trend Discovery (`/dashboard/dropai`)
*   **Validation:** Confirmed `geo` and `date` parameters are required for the SerpApi Google Trends call.
*   **UI:** Retain Region and Timeframe selectors.
*   **Navigation:** Ensure "Analyze" buttons on breakout cards correctly transition to the Competitive Analysis phase with the selected keyword context.

### 2. Competitive Analysis (`/dashboard/dropai/competitive`)
*   **Cleanup:** Remove individual "Save Seller", "Find Suppliers", and "Save Wholesaler" buttons from competitor cards and marketplace sections.
*   **Intelligence Capture:** Extract and prepare the following metrics for persistence:
    *   Average Market Price
    *   Number of Shopping Competitors
    *   Marketplace Stores Spy Count
*   **Primary Action:** A single page-level action to "Proceed to Supplier Discovery".

### 3. Supplier Discovery (`/dashboard/dropai/suppliers`)
*   **Cleanup:** Remove "Catalog" and "Save Wholesaler" buttons from supplier cards.
*   **Intelligence Capture:** Extract and prepare the Profit Margin Calculator metrics:
    *   Average Retail Price vs. Lowest Wholesale Price
    *   Gross Margin & Margin Percentage
    *   Opportunity Verdict
*   **Final Action:** Implement a **"Mark as Winning Product"** button that triggers a unified server action to save the entire pipeline state.

---

## Phase 2: Database Architecture Redesign

### 1. Schema Cleanup
Remove obsolete tables from `server/db/schema/schema.ts`:
*   `productResults`, `supplierLinks`, `competitors`, `savedProducts`, `savedSellers`, `searchHistory`.

### 2. New Consolidated Schema
Implement a robust relational structure for winning products:

*   **`winning_products`**: Core table (id, user_id, keyword, region, timeframe, created_at).
*   **`pipeline_data`**: A single table (or set of tables) storing:
    *   **Trend Data:** The specific breakout info from Step 1.
    *   **Market Intelligence:** Paid/Organic landscape metrics (Avg Price, Comp Count, etc.).
    *   **Competitive Listings:** Array of top competitors found.
    *   **Supplier Listings:** Array of sourced products from AliExpress/others.
    *   **Profitability Metrics:** Final calculated margins and verdict.

---

## Phase 3: Pipeline Review & Dashboard

### 1. Winning Products Dashboard (`/dashboard/saved`)
*   Create a clean grid view of all "Winning Products" saved by the user.
*   Display high-level signals (Keyword, Region, Profit Margin Verdict).

### 2. Detailed Pipeline Review (`/dashboard/product/[id]`)
*   A dedicated route to inspect the full intelligence report for a saved product.
*   **Layout:**
    *   **Header:** Keyword, Date, and Final Verdict.
    *   **Section 1:** Trend Discovery Context.
    *   **Section 2:** Market Intelligence & Competitive Landscape.
    *   **Section 3:** Supplier Sourcing & Comparison.
    *   **Section 4:** Final Profitability Analysis.

---

## Execution Checklist
1. [ ] Update `server/db/schema/schema.ts` with new pipeline-centric tables.
2. [ ] Generate and apply Drizzle migrations.
3. [ ] Refactor `/dashboard/dropai/competitive` to remove fragmented actions and prepare market intelligence data.
4. [ ] Refactor `/dashboard/dropai/suppliers` to remove fragmented actions and prepare profitability data.
5. [ ] Create a unified Server Action `saveWinningProduct` in `server/actions/DropAiActions.ts`.
6. [ ] Implement the `/dashboard/product/[id]` route to render the consolidated report.
7. [ ] Update `/dashboard/saved/page.tsx` to list the new winning product records.
