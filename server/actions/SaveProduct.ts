'use server'

import { db } from '@/server/db'
import { winningProducts } from '@/server/db/schema/schema'
import { getAuthUserId } from '@/lib/server-session'
import { eq, desc } from 'drizzle-orm'

export async function getSavedProducts() {
  const userId = await getAuthUserId()
  if (!userId) return { success: true, data: [] }

  try {
    const saved = await db
      .select({
        id: winningProducts.id,
        keyword: winningProducts.keyword,
        region: winningProducts.region,
        timeframe: winningProducts.timeframe,
        createdAt: winningProducts.createdAt,
        // We only select the specific parts of pipelineData needed for the list if possible, 
        // or just select it as is if it's not too large for the specific use case, 
        // but selecting specific columns is always better.
        pipelineData: winningProducts.pipelineData, 
      })
      .from(winningProducts)
      .where(eq(winningProducts.userId, userId))
      .orderBy(desc(winningProducts.createdAt))

    return { success: true, data: saved }
  } catch (error) {
    console.error('Failed to get saved products:', error)
    return { success: true, data: [] }
  }
}

export async function deleteWinningProduct(id: string) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Not authenticated' }

  try {
    await db
      .delete(winningProducts)
      .where(eq(winningProducts.id, id))

    return { success: true }
  } catch (error) {
    console.error('Failed to delete product:', error)
    return { success: false, error: 'Failed to remove product' }
  }
}
