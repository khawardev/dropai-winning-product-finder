'use server'

import { db } from '@/server/db'
import { productResults, supplierLinks, competitors } from '@/server/db/schema/schema'
import { eq, desc } from 'drizzle-orm'

export async function getProductResults(searchId?: string) {
  try {
    let query = db
      .select()
      .from(productResults)
      .orderBy(desc(productResults.discoveredAt))
      .limit(20)

    if (searchId) {
      // @ts-ignore - drizzle-orm type issue with dynamic queries in this simple form
      query = db
        .select()
        .from(productResults)
        .where(eq(productResults.searchId, searchId))
        .orderBy(desc(productResults.discoveredAt))
        .limit(20)
    }

    const products = await query

    const productsWithRelations = await Promise.all(
      products.map(async (product) => {
        const suppliers = await db
          .select()
          .from(supplierLinks)
          .where(eq(supplierLinks.productId, product.id))
          
        const comps = await db
          .select()
          .from(competitors)
          .where(eq(competitors.productId, product.id))

        return { ...product, suppliers, competitors: comps }
      })
    )

    return { success: true, data: productsWithRelations }
  } catch (error) {
    console.error('Failed to get product results:', error)
    return { success: true, data: [] }
  }
}

export async function getProductById(id: string) {
  try {
    const [product] = await db
      .select()
      .from(productResults)
      .where(eq(productResults.id, id))
      .limit(1)

    if (!product) return { success: false, error: 'Product not found' }

    const suppliers = await db
      .select()
      .from(supplierLinks)
      .where(eq(supplierLinks.productId, product.id))
      
    const comps = await db
      .select()
      .from(competitors)
      .where(eq(competitors.productId, product.id))

    return { success: true, data: { ...product, suppliers, competitors: comps } }
  } catch (error) {
    console.error('Failed to get product:', error)
    return { success: false, error: 'Failed to fetch product' }
  }
}
