'use server'

import { db } from '@/server/db'
import { winningProducts } from '@/server/db/schema/schema'
import { eq, desc } from 'drizzle-orm'

export async function getProductResults() {
  try {
    const products = await db
      .select({
        id: winningProducts.id,
        keyword: winningProducts.keyword,
        region: winningProducts.region,
        timeframe: winningProducts.timeframe,
        pipelineData: winningProducts.pipelineData,
        createdAt: winningProducts.createdAt,
      })
      .from(winningProducts)
      .orderBy(desc(winningProducts.createdAt))
      .limit(20)

    return { success: true, data: products }
  } catch (error) {
    console.error('Failed to get product results:', error)
    return { success: true, data: [] }
  }
}

export async function getProductById(id: string) {
  try {
    const [product] = await db
      .select()
      .from(winningProducts)
      .where(eq(winningProducts.id, id))
      .limit(1)

    if (!product) return { success: false, error: 'Product not found' }

    return { success: true, data: product }
  } catch (error) {
    console.error('Failed to get product:', error)
    return { success: false, error: 'Failed to fetch product' }
  }
}

export async function updateProductAIAnalysis(id: string, analysis: any) {
  try {
    const [product] = await db
      .select({ aiAnalysis: winningProducts.aiAnalysis })
      .from(winningProducts)
      .where(eq(winningProducts.id, id))
      .limit(1)

    const currentAnalysis = (product?.aiAnalysis as any[]) || []
    const updatedAnalysis = [analysis, ...currentAnalysis]

    await db
      .update(winningProducts)
      .set({ aiAnalysis: updatedAnalysis })
      .where(eq(winningProducts.id, id))

    return { success: true }
  } catch (error) {
    console.error('Failed to update AI analysis:', error)
    return { success: false, error: 'Failed to save analysis' }
  }
}
