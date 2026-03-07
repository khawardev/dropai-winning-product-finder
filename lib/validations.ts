import { z } from 'zod'

export const ProductSearchInputSchema = z.object({
  niche: z.string().min(1, 'Niche keyword is required'),
  country: z.string().min(1, 'Target country is required'),
  audience: z.string().optional().default('General Consumer'),
  category: z.string().optional().default('All Categories'),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  shippingLimit: z.number().optional(),
})

export type ProductSearchInput = z.infer<typeof ProductSearchInputSchema>

export const TrendResultSchema = z.object({
  productName: z.string(),
  demandScore: z.number().min(0).max(100),
  trending: z.boolean(),
  socialProof: z.string().optional(),
  trendReason: z.string().optional(),
})

export const SupplierResultSchema = z.object({
  supplierName: z.string(),
  costPrice: z.number(),
  shippingCost: z.number(),
  shippingDays: z.number(),
  reliabilityScore: z.number().min(0).max(100),
  productUrl: z.string().optional(),
  location: z.string(),
  minOrder: z.string().optional(),
  categories: z.array(z.string()).optional(),
})

export const ProfitAnalysisSchema = z.object({
  sellingPrice: z.number(),
  costOfGoods: z.number(),
  shippingCost: z.number(),
  estimatedAdSpend: z.number(),
  netProfit: z.number(),
  profitMargin: z.number(),
  competitionLevel: z.enum(['Low', 'Medium', 'High']),
  launchAdvice: z.string().optional(),
  riskAssessment: z.string().optional(),
})

export const FinalProductResultSchema = z.object({
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  demandScore: z.number(),
  profitMargin: z.number(),
  competitionLevel: z.enum(['Low', 'Medium', 'High']),
  shippingDays: z.number(),
  trending: z.boolean(),
  costPrice: z.number(),
  sellingPrice: z.number(),
  suppliers: z.array(SupplierResultSchema),
  profitAnalysis: ProfitAnalysisSchema,
  aiNotes: z.string().optional(),
})

export const ProductDiscoveryOutputSchema = z.object({
  products: z.array(FinalProductResultSchema),
})

export type ProductDiscoveryOutput = z.infer<typeof ProductDiscoveryOutputSchema>

export const SaveProductInputSchema = z.object({
  productId: z.string().uuid(),
  notes: z.string().optional(),
})

export type SaveProductInput = z.infer<typeof SaveProductInputSchema>
