import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { trendSpotterAgent } from '../agents/TrendSpotter'
import { supplierHunterAgent } from '../agents/SupplierHunter'
import { logisticsAuditorAgent } from '../agents/LogisticsAuditor'
import { intelligenceOfficerAgent } from '../agents/IntelligenceOfficer'
import { performanceAnalystAgent } from '../agents/PerformanceAnalyst'
import { profitAnalystAgent } from '../agents/ProfitAnalyst'

const discoveryInputSchema = z.object({
  niche: z.string(),
  country: z.string(),
  audience: z.string().optional(),
  category: z.string().optional(),
  priceMax: z.number().optional(),
})

const discoveryOutputSchema = z.object({
  finalAnalysis: z.string(),
})

const identifyTrendsStep = createStep({
  id: 'identify-trends',
  inputSchema: discoveryInputSchema,
  outputSchema: z.object({
    trendData: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { niche, country } = inputData
    const prompt = `CRITICAL: You MUST use your tools to fetch REAL data first. Do NOT hallucinate products.
Identify 3-5 trending products in the "${niche}" niche for the ${country} market. Use serpapi-trends-tool to verify search trends and apify-tiktok-tool to verify social media viral signals.`
    const result = await trendSpotterAgent.generate(prompt, { maxSteps: 5 })
    return { trendData: result.text }
  },
})

const sourceSuppliersStep = createStep({
  id: 'source-suppliers',
  inputSchema: z.object({
    trendData: z.string(),
  }),
  outputSchema: z.object({
    supplierData: z.string(),
  }),
  execute: async ({ inputData, getInitData }) => {
    const { trendData } = inputData
    const initData = getInitData() as z.infer<typeof discoveryInputSchema>
    const prompt = `CRITICAL: You MUST use your tools to fetch REAL supplier data first. Do NOT hallucinate suppliers or prices.
Based on these trending products: ${trendData}, source 2-3 reliable suppliers for each product shipping to ${initData.country}. Use serpapi-shopping-tool with query "site:aliexpress.com {product name}" to find live AliExpress listings and prices.`
    const result = await supplierHunterAgent.generate(prompt, { maxSteps: 5 })
    return { supplierData: result.text }
  },
})

const auditLogisticsStep = createStep({
  id: 'audit-logistics',
  inputSchema: z.object({
    supplierData: z.string(),
  }),
  outputSchema: z.object({
    validatedSuppliers: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { supplierData } = inputData
    const prompt = `CRITICAL: You MUST use your tools to fetch REAL data. Do NOT hallucinate.
Validate these suppliers and products: ${supplierData}. Find shipping estimates, delivery times, and evaluate reliability.`
    const result = await logisticsAuditorAgent.generate(prompt, { maxSteps: 5 })
    return { validatedSuppliers: result.text }
  },
})

const gatherIntelligenceStep = createStep({
  id: 'gather-intelligence',
  inputSchema: z.object({
    trendData: z.string(),
  }),
  outputSchema: z.object({
    competitiveLandscape: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { trendData } = inputData
    const prompt = `CRITICAL: You MUST use your tools to fetch REAL data. Do NOT hallucinate.
For these products: ${trendData}, find who is selling them at retail prices using eBay, Walmart, and Google Shopping APIs. Gather competitor names, prices, and ratings.`
    const result = await intelligenceOfficerAgent.generate(prompt, { maxSteps: 5 })
    return { competitiveLandscape: result.text }
  },
})

const benchmarkPerformanceStep = createStep({
  id: 'benchmark-performance',
  inputSchema: z.object({
    competitiveLandscape: z.string(),
  }),
  outputSchema: z.object({
    performanceBenchmarks: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { competitiveLandscape } = inputData
    const prompt = `CRITICAL: You MUST use your tools to fetch REAL data. Do NOT hallucinate.
Analyze these competitors and products: ${competitiveLandscape}. Find Shopify stores specifically and analyze price distribution, shipping speeds, and reviews to identify weaknesses.`
    const result = await performanceAnalystAgent.generate(prompt, { maxSteps: 5 })
    return { performanceBenchmarks: result.text }
  },
})

const calculateProfitabilityStep = createStep({
  id: 'calculate-profitability',
  inputSchema: z.object({
    validatedSuppliers: z.string(),
    performanceBenchmarks: z.string(),
    competitiveLandscape: z.string(),
  }),
  outputSchema: z.object({
    finalAnalysis: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { validatedSuppliers, performanceBenchmarks, competitiveLandscape } = inputData
    const prompt = `CRITICAL: Do NOT hallucinate. Synthesize this data into a final JSON report:
Validated Suppliers (Wholesale Cost): ${validatedSuppliers}
Competitive Landscape (Retail Price): ${competitiveLandscape}
Performance Benchmarks (Market Gaps): ${performanceBenchmarks}
Calculate Gross Margin, Net Margin, Market Gap Score, and give a GO/NO-GO verdict.`
    const result = await profitAnalystAgent.generate(prompt, { maxSteps: 5 })
    return { finalAnalysis: result.text }
  },
})

export const productDiscoveryWorkflow = createWorkflow({
  id: 'product-discovery',
  inputSchema: discoveryInputSchema,
  outputSchema: discoveryOutputSchema,
})
  .then(identifyTrendsStep)
  .then(sourceSuppliersStep)
  .then(auditLogisticsStep)
  .map(async ({ getStepResult }) => {
    const trendResult = getStepResult('identify-trends') as { trendData: string }
    return { trendData: trendResult.trendData }
  })
  .then(gatherIntelligenceStep)
  .map(async ({ inputData }) => {
    return { competitiveLandscape: inputData.competitiveLandscape }
  })
  .then(benchmarkPerformanceStep)
  .map(async ({ getStepResult }) => {
    const logisticsResult = getStepResult('audit-logistics') as { validatedSuppliers: string }
    const intelResult = getStepResult('gather-intelligence') as { competitiveLandscape: string }
    const perfResult = getStepResult('benchmark-performance') as { performanceBenchmarks: string }
    return {
      validatedSuppliers: logisticsResult.validatedSuppliers,
      competitiveLandscape: intelResult.competitiveLandscape,
      performanceBenchmarks: perfResult.performanceBenchmarks
    }
  })
  .then(calculateProfitabilityStep)
  .commit()
