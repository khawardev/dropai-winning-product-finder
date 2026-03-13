'use server'

import { db } from '@/server/db'
import { winningProducts } from '@/server/db/schema/schema'
import { desc } from 'drizzle-orm'

export async function getSuppliers() {
  try {
    const products = await db
      .select({
        keyword: winningProducts.keyword,
        pipelineData: winningProducts.pipelineData
      })
      .from(winningProducts)
      .orderBy(desc(winningProducts.createdAt))
      .limit(100);

    const allSuppliers: any[] = [];
    const seenUrls = new Set();

    products.forEach((p: any) => {
      const pipeline = p.pipelineData || {};
      const suppliers = pipeline.suppliers?.suppliers || [];
      const productName = p.keyword;
      
      suppliers.forEach((s: any) => {
        if (s.is_verified && s.link) {
          const cleanUrl = s.link.split('?')[0].replace('www.', '');
          if (!seenUrls.has(cleanUrl)) {
            seenUrls.add(cleanUrl);
            allSuppliers.push({
              id: cleanUrl,
              name: s.supplierName || s.source || 'Verified Factory',
              location: s.location || 'Global',
              shippingDays: s.shippingDays || 7,
              reliabilityScore: s.reliabilityScore || 95,
              minOrder: s.minOrder || '1 Unit',
              categories: s.categories || ['Wholesale'],
              link: s.link,
              productName, // New field
              rating: s.rating,
              reviews: s.reviews,
              thumbnail: s.thumbnail || s.favicon,
              sourcingPrice: s.extracted_price || s.price?.extracted_value || 0,
            });
          }
        }
      });
    });

    return { success: true, data: allSuppliers };
  } catch (error) {
    console.error('Failed to get suppliers:', error);
    return { success: false, data: [] };
  }
}
