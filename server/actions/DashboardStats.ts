'use server'

import { db } from '@/server/db'
import { productResults, supplierLinks, savedProducts } from '@/server/db/schema/schema'
import { getAuthUserId } from '@/lib/server-session'
import { eq, desc, sql, count } from 'drizzle-orm'

export async function getDashboardStats() {
  try {
    const userId = await getAuthUserId()

    const [productsAnalyzed] = await db
      .select({ count: count() })
      .from(productResults)

    const [activeSuppliers] = await db
      .select({ count: count() })
      .from(supplierLinks)

    const [savedCount] = await db
      .select({ count: count() })
      .from(savedProducts)
      .where(userId ? eq(savedProducts.userId, userId) : undefined)

    const revenueResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${productResults.sellingPrice} AS NUMERIC) - CAST(${productResults.costPrice} AS NUMERIC)), 0)`,
      })
      .from(productResults)

    const potentialRevenue = revenueResult[0]?.total || 0

    const recentProducts = await db
      .select()
      .from(productResults)
      .orderBy(desc(productResults.discoveredAt))
      .limit(5)
      
    const trendResult = await db
      .select({
        name: sql<string>`to_char(DATE(${productResults.discoveredAt}), 'Mon DD')`,
        value: count(),
      })
      .from(productResults)
      .groupBy(sql`DATE(${productResults.discoveredAt})`)
      .orderBy(sql`DATE(${productResults.discoveredAt}) ASC`)
      .limit(7)

    const categoryResult = await db
      .select({
        name: sql<string>`COALESCE((
          SELECT json_array_elements_text(CAST(${supplierLinks.categories} AS json)) 
          FROM ${supplierLinks} 
          WHERE ${supplierLinks.productId} = ${productResults.id} 
          LIMIT 1
        ), 'General')`,
        value: count(),
      })
      .from(productResults)
      .groupBy(sql`1`)
      .orderBy(desc(count()))
      .limit(4)

    return {
      success: true,
      data: {
        productsAnalyzed: productsAnalyzed?.count || 0,
        activeSuppliers: activeSuppliers?.count || 0,
        savedProducts: savedCount?.count || 0,
        potentialRevenue: Number(potentialRevenue),
        trendData: trendResult.map(t => ({ name: t.name, value: t.value * 100 })),
        categoryData: categoryResult.map(c => ({ name: c.name, value: c.value * 10 })),
        recentProducts: recentProducts.map((p) => ({
          id: p.id,
          name: p.name,
          demandScore: Number(p.demandScore) || 0,
          profitMargin: Number(p.profitMargin) || 0,
          competitionLevel: p.competitionLevel || 'Medium',
          trending: p.trending || false,
        })),
      },
    }
  } catch (error) {
    console.error('Failed to get dashboard stats:', error)
    return {
      success: true,
      data: {
        productsAnalyzed: 0,
        activeSuppliers: 0,
        savedProducts: 0,
        potentialRevenue: 0,
        trendData: [],
        categoryData: [],
        recentProducts: [],
      },
    }
  }
}
