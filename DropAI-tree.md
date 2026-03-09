```markdown
. 📂 dropai---winning-product-finder-2
├── 📄 README.md
└── 📂 app/
│  └── 📂 api/
│    └── 📂 auth/
│      └── 📂 [...all]/
│        ├── 📄 route.ts
│    └── 📂 chat/
│      ├── 📄 route.ts
│    └── 📂 search/
│      └── 📂 recent/
│        ├── 📄 route.ts
│  └── 📂 dashboard/
│    └── 📂 finder/
│      ├── 📄 page.tsx
│    ├── 📄 layout.tsx
│    ├── 📄 page.tsx
│    └── 📂 product/
│      └── 📂 [id]/
│        ├── 📄 page.tsx
│    └── 📂 reports/
│      ├── 📄 page.tsx
│    └── 📂 results/
│      ├── 📄 page.tsx
│    └── 📂 saved/
│      ├── 📄 page.tsx
│    └── 📂 settings/
│      ├── 📄 page.tsx
│    └── 📂 suppliers/
│      ├── 📄 page.tsx
│  ├── 📄 globals.css
│  ├── 📄 layout.tsx
│  └── 📂 login/
│    ├── 📄 page.tsx
│  ├── 📄 not-found.tsx
│  ├── 📄 page.tsx
│  └── 📂 signup/
│    ├── 📄 page.tsx
└── 📂 components/
│  ├── 📄 AIChatAssistant.tsx
│  ├── 📄 DashboardComponents.tsx
│  ├── 📄 ThemeProvider.tsx
│  ├── 📄 ThemeToggle.tsx
│  └── 📂 ui/
│    ├── 📄 button.tsx
│    ├── 📄 card.tsx
│    ├── 📄 input.tsx
│    ├── 📄 progress.tsx
│    ├── 📄 switch.tsx
│    ├── 📄 tabs.tsx
│    ├── 📄 tooltip.tsx
└── 📂 docs/
│  └── 📂 SerpApi/
│    ├── 📄 Claude-SerpApi.md
│    ├── 📄 Final SerpAPI Implementation Guide.md
│    ├── 📄 Gemini-Serpapi.md
│    ├── 📄 Serpapi-Prompt.md
│    ├── 📄 Serpapi-doc.md
│  ├── 📄 landing-page-ui-prompt.md
│  └── 📂 other/
│    └── 📂 Apis/
│      ├── 📄 API_INTEGRATIONS.md
│      └── 📂 apify/
│        ├── 📄 aliexpress-product-search.md
│        ├── 📄 e-commerce-scraping-tool.md
│        ├── 📄 shopify-products-scraper.md
│        ├── 📄 tiktok-hashtag-scraper.md
│      └── 📂 responses/
│        ├── 📄 serpapi-google-search.json
│        ├── 📄 serpapi-shopping.json
│        ├── 📄 serpapi-trends.json
│      └── 📂 serpapi/
│        ├── 📄 google-shopping-api.md
│        ├── 📄 google-trends-api.md
│    └── 📂 Mastra/
│      ├── 📄 0.1.Studio.md
│      ├── 📄 0.Project_Structure.md
│      ├── 📄 1.Using_Agents.md
│      ├── 📄 2.Using_Tools.md
│      ├── 📄 3.Agent_Memory.md
│      ├── 📄 4.Structured_Output.md
│      ├── 📄 5.Supervisor_Agents.md
│      ├── 📄 6.Agent_Networks.md
│      ├── 📄 7.MCP_Overview.md
│    └── 📂 claude/
│      ├── 📄 Code Guide.md
│      ├── 📄 Current Project Tree.md
│      ├── 📄 Flow Guide.md
│      ├── 📄 Flow Prompt.md
│      ├── 📄 GUIDE2.MD
│      ├── 📄 Implementation Guide.md
│      ├── 📄 OVERVIEW IMPLIMENTATION FLOW.MD
│    └── 📂 dropAI/
│      ├── 📄 API_WORKFLOW_GUIDE.md
│      ├── 📄 claude-dropai-implementation.md
│      └── 📂 implimentation/
│        ├── 📄 Serp-Api-Google-Trends-API.md
│        ├── 📄 features.md
│        ├── 📄 implimentation-doc.md
│        ├── 📄 kimi-api-setup.md
│        ├── 📄 project-tree.md
│      ├── 📄 kimi-dropai-implementation.md
│      ├── 📄 persona.md
│      ├── 📄 prompt.md
│    └── 📂 frontend/
│      ├── 📄 IMPLEMENTATION_GUIDE.md
│      ├── 📄 pages-documentation.md
├── 📄 drizzle.config.ts
└── 📂 hooks/
│  ├── 📄 use-mobile.ts
└── 📂 lib/
│  ├── 📄 auth-client.ts
│  ├── 📄 auth.ts
│  ├── 📄 constants.ts
│  ├── 📄 server-session.ts
│  ├── 📄 utils.ts
│  ├── 📄 validations.ts
└── 📂 mastra/
│  └── 📂 agents/
│    ├── 📄 IntelligenceOfficer.ts
│    ├── 📄 LogisticsAuditor.ts
│    ├── 📄 PerformanceAnalyst.ts
│    ├── 📄 ProfitAnalyst.ts
│    ├── 📄 SupplierHunter.ts
│    ├── 📄 TrendSpotter.ts
│    ├── 📄 index.ts
│  ├── 📄 index.ts
│  └── 📂 mcp/
│    ├── 📄 client.ts
│    ├── 📄 server.ts
│  └── 📂 public/
│  └── 📂 tools/
│    ├── 📄 ApifyAliExpressTool.ts
│    ├── 📄 ApifyShopifyTool.ts
│    ├── 📄 ApifyTikTokTool.ts
│    ├── 📄 SerpApiEbayTool.ts
│    ├── 📄 SerpApiGoogleSearchTool.ts
│    ├── 📄 SerpApiShoppingTool.ts
│    ├── 📄 SerpApiTrendsTool.ts
│    ├── 📄 SerpApiWalmartTool.ts
│  └── 📂 workflows/
│    ├── 📄 ProductDiscovery.ts
├── 📄 metadata.json
├── 📄 next.config.ts
├── 📄 package.json
├── 📄 pnpm-lock.yaml
├── 📄 postcss.config.mjs
├── 📄 proxy.ts
└── 📂 server/
│  └── 📂 actions/
│    ├── 📄 DashboardStats.ts
│    ├── 📄 ProductResults.ts
│    ├── 📄 ProductSearch.ts
│    ├── 📄 ReportsData.ts
│    ├── 📄 SaveProduct.ts
│    ├── 📄 SupplierQueries.ts
│  └── 📂 db/
│    ├── 📄 index.ts
│    └── 📂 migrations/
│      ├── 📄 0000_bent_sunset_bain.sql
│      ├── 📄 0001_busy_quasar.sql
│      └── 📂 meta/
│        ├── 📄 0000_snapshot.json
│        ├── 📄 0001_snapshot.json
│        ├── 📄 _journal.json
│    └── 📂 schema/
│      ├── 📄 schema.ts
├── 📄 skills-lock.json
└── 📄 tsconfig.json
```