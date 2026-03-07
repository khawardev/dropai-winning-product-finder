'use server'

import { db } from '@/server/db'
import { supplierLinks } from '@/server/db/schema/schema'
import { desc } from 'drizzle-orm'

export async function getSuppliers() {
  try {
    const suppliers = await db
      .select()
      .from(supplierLinks)
      .orderBy(desc(supplierLinks.reliabilityScore))
      .limit(50)

    const uniqueSuppliers = new Map<string, any>()
    for (const s of suppliers) {
      if (!uniqueSuppliers.has(s.supplierName)) {
        uniqueSuppliers.set(s.supplierName, {
          id: s.id,
          name: s.supplierName,
          location: s.location || 'China',
          shippingDays: s.shippingDays || 7,
          reliabilityScore: Number(s.reliabilityScore) || 0,
          minOrder: s.minOrder || '1 unit',
          categories: (s.categories as string[]) || [],
          verified: s.verified || false,
          costPrice: Number(s.costPrice) || 0,
        })
      }
    }

    return { success: true, data: Array.from(uniqueSuppliers.values()) }
  } catch (error) {
    console.error('Failed to get suppliers:', error)
    return { success: true, data: [] }
  }
}
