'use server'

import { db } from '@/server/db'
import { savedProducts, productResults, supplierLinks } from '@/server/db/schema/schema'
import { SaveProductInputSchema } from '@/lib/validations'
import { getAuthUserId } from '@/lib/server-session'
import { eq, and, desc } from 'drizzle-orm'

export async function saveProduct(productId: string, notes?: string) {
  const validated = SaveProductInputSchema.safeParse({ productId, notes })
  if (!validated.success) {
    return { success: false, error: 'Invalid input' }
  }

  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Not authenticated' }

  try {
    const existing = await db
      .select()
      .from(savedProducts)
      .where(
        and(
          eq(savedProducts.userId, userId),
          eq(savedProducts.productId, productId)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      return { success: true, alreadySaved: true }
    }

    await db.insert(savedProducts).values({
      userId,
      productId,
      notes: notes || null,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to save product:', error)
    return { success: false, error: 'Failed to save product' }
  }
}

export async function unsaveProduct(productId: string) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Not authenticated' }

  try {
    await db
      .delete(savedProducts)
      .where(
        and(
          eq(savedProducts.userId, userId),
          eq(savedProducts.productId, productId)
        )
      )

    return { success: true }
  } catch (error) {
    console.error('Failed to unsave product:', error)
    return { success: false, error: 'Failed to remove saved product' }
  }
}

export async function getSavedProducts() {
  const userId = await getAuthUserId()
  if (!userId) return { success: true, data: [] }

  try {
    const saved = await db
      .select()
      .from(savedProducts)
      .where(eq(savedProducts.userId, userId))
      .orderBy(desc(savedProducts.savedAt))

    const productsWithDetails = await Promise.all(
      saved.map(async (s) => {
        if (!s.productId) return null

        const [product] = await db
          .select()
          .from(productResults)
          .where(eq(productResults.id, s.productId))
          .limit(1)

        if (!product) return null

        const suppliers = await db
          .select()
          .from(supplierLinks)
          .where(eq(supplierLinks.productId, product.id))

        return {
          ...product,
          savedAt: s.savedAt,
          savedNotes: s.notes,
          suppliers,
        }
      })
    )

    return { success: true, data: productsWithDetails.filter(Boolean) }
  } catch (error) {
    console.error('Failed to get saved products:', error)
    return { success: true, data: [] }
  }
}

export async function getSavedProductIds() {
  const userId = await getAuthUserId()
  if (!userId) return []

  try {
    const saved = await db
      .select({ productId: savedProducts.productId })
      .from(savedProducts)
      .where(eq(savedProducts.userId, userId))

    return saved.map((s) => s.productId)
  } catch (error) {
    return []
  }
}
