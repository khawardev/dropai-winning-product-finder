'use server'

import { db } from '@/server/db'
import { savedSellers, productResults, supplierLinks, competitors, searchHistory } from '@/server/db/schema/schema'
import { getAuthUserId } from '@/lib/server-session'
import { eq, and } from 'drizzle-orm'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

export async function saveSeller(data: {
  domain: string
  name: string
  image?: string
  source?: string
  type: string
}) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Not authenticated' }

  try {
    const existing = await db
      .select()
      .from(savedSellers)
      .where(
        and(
          eq(savedSellers.userId, userId),
          eq(savedSellers.domain, data.domain)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      return { success: true, alreadySaved: true }
    }

    await db.insert(savedSellers).values({
      userId,
      domain: data.domain,
      name: data.name,
      image: data.image || null,
      source: data.source || null,
      type: data.type,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to save seller:', error)
    return { success: false, error: 'Failed to save seller' }
  }
}

export async function getSavedSellers() {
  const userId = await getAuthUserId()
  if (!userId) return { success: true, data: [] }

  try {
    const sellers = await db
      .select()
      .from(savedSellers)
      .where(eq(savedSellers.userId, userId))

    return { success: true, data: sellers }
  } catch (error) {
    console.error('Failed to get saved sellers:', error)
    return { success: false, data: [] }
  }
}

export async function removeSavedSeller(domain: string) {
  const userId = await getAuthUserId()
  if (!userId) return { success: false, error: 'Not authenticated' }

  try {
    await db
      .delete(savedSellers)
      .where(
        and(
          eq(savedSellers.userId, userId),
          eq(savedSellers.domain, domain)
        )
      )

    return { success: true }
  } catch (error) {
    console.error('Failed to remove saved seller:', error)
    return { success: false, error: 'Failed to remove saved seller' }
  }
}

export async function analyzeAndSaveWinningProduct(payload: {
  keyword: string;
  imageUrl?: string | null;
  retailPrice: number;
  wholesalePrice: number;
  suppliers: any[];
  competitors?: any[];
}) {
  const userId = await getAuthUserId()

  try {
    // We use AI to generate a summarized analysis based on raw inputs
    const { object: aiAnalysis } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        productName: z.string(),
        description: z.string(),
        demandScore: z.number(),
        profitMargin: z.number(),
        competitionLevel: z.string(),
        aiNotes: z.string(),
        marketGapScore: z.number(),
        verdict: z.string()
      }),
      prompt: `Analyze the following dropshipping product data and provide a comprehensive summary:
        Keyword/Niche: ${payload.keyword}
        Average Retail Price: $${payload.retailPrice}
        Lowest Wholesale Price: $${payload.wholesalePrice}
        Suppliers Found: ${payload.suppliers.length}
        Competitors Found: ${payload.competitors?.length || 0}
        
        Generate a catchy product name, a sales description, estimate demand (0-100), and give a final verdict (GO/NO-GO).`
    })

    // Save search history entry first to tie product
    let searchId = null;
    if (userId) {
      const [search] = await db.insert(searchHistory).values({
        userId,
        niche: payload.keyword,
        targetCountry: 'US', // default
        status: 'completed',
        cacheKey: `dropai-${Date.now()}`
      }).returning({ id: searchHistory.id });
      searchId = search.id;
    }

    // Save product
    const [product] = await db.insert(productResults).values({
      searchId,
      name: aiAnalysis.productName,
      description: aiAnalysis.description,
      imageUrl: payload.imageUrl || payload.suppliers[0]?.thumbnail || '',
      demandScore: String(aiAnalysis.demandScore),
      profitMargin: String(aiAnalysis.profitMargin),
      competitionLevel: aiAnalysis.competitionLevel,
      costPrice: String(payload.wholesalePrice),
      sellingPrice: String(payload.retailPrice),
      suppliersCount: payload.suppliers.length,
      aiAnalysis: {
        aiNotes: aiAnalysis.aiNotes,
        marketGapScore: aiAnalysis.marketGapScore,
        verdict: aiAnalysis.verdict
      }
    }).returning({ id: productResults.id });

    // Save Top 5 Suppliers
    const topSuppliers = payload.suppliers.slice(0, 5);
    if (topSuppliers.length > 0) {
      await db.insert(supplierLinks).values(topSuppliers.map(s => ({
        productId: product.id,
        supplierName: s.source || 'Wholesale Supplier',
        costPrice: String(s.extracted_price || 0),
        productUrl: s.link,
        verified: !!s.is_verified,
        location: 'Global',
      })));
    }

    // Save Top 5 Competitors
    const topCompetitors = (payload.competitors || []).slice(0, 5);
    if (topCompetitors.length > 0) {
      await db.insert(competitors).values(topCompetitors.map(c => ({
        productId: product.id,
        sellerName: c.source || 'Competitor',
        platform: 'Shopify/Google',
        retailPrice: String(c.extracted_price || c.price || 0),
      })));
    }

    return { success: true, productId: product.id }
  } catch (error) {
    console.error('Failed to analyze and save winning product:', error)
    return { success: false, error: 'AI analysis failed' }
  }
}

