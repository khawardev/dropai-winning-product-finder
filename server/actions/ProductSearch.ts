'use server'

import { db } from '@/server/db'
import { searchHistory, productResults, supplierLinks, competitors } from '@/server/db/schema/schema'
import { ProductSearchInputSchema } from '@/lib/validations'
import { SEARCH_STATUSES, CACHE_DURATION_HOURS } from '@/lib/constants'
import { getAuthUserId } from '@/lib/server-session'
import { eq, and, gte, desc } from 'drizzle-orm'
import { mastra } from '@/mastra'
import crypto from 'crypto'

function generateCacheKey(input: { niche: string; country: string; audience?: string; category?: string }): string {
  const normalized = `${input.niche.toLowerCase().trim()}|${input.country.toLowerCase().trim()}|${(input.audience || '').toLowerCase()}|${(input.category || '').toLowerCase()}`
  return crypto.createHash('md5').update(normalized).digest('hex')
}

function extractJsonFromText(text: string): any {
  try {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim())
    }

    const objectMatch = text.match(/\{[\s\S]*\}/)
    if (objectMatch) {
      return JSON.parse(objectMatch[0])
    }

    return JSON.parse(text)
  } catch (err) {
    console.error('JSON Extraction failed', err)
    return null
  }
}

export async function searchProducts(formData: FormData) {
  const rawInput = {
    niche: formData.get('niche') as string,
    country: formData.get('country') as string,
    audience: formData.get('audience') as string,
    category: formData.get('category') as string,
    priceMin: formData.get('priceMin') ? Number(formData.get('priceMin')) : undefined,
    priceMax: formData.get('priceMax') ? Number(formData.get('priceMax')) : undefined,
    shippingLimit: formData.get('shippingLimit') ? Number(formData.get('shippingLimit')) : undefined,
  }

  const validated = ProductSearchInputSchema.safeParse(rawInput)
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors }
  }

  const input = validated.data
  const cacheKey = generateCacheKey(input)

  try {
    const cutoff = new Date(Date.now() - CACHE_DURATION_HOURS * 60 * 60 * 1000)
    const cached = await db
      .select()
      .from(searchHistory)
      .where(
        and(
          eq(searchHistory.cacheKey, cacheKey),
          gte(searchHistory.createdAt, cutoff),
          eq(searchHistory.status, SEARCH_STATUSES.COMPLETED)
        )
      )
      .orderBy(desc(searchHistory.createdAt))
      .limit(1)

    if (cached.length > 0) {
      const cachedProducts = await db
        .select()
        .from(productResults)
        .where(eq(productResults.searchId, cached[0].id))

      const productsWithRelations = await Promise.all(
        cachedProducts.map(async (product) => {
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

      return { success: true, data: productsWithRelations, cached: true }
    }
  } catch (dbError) {
    console.warn('Database cache check failed, proceeding with AI:', dbError)
  }

  let searchRecord: any = null
  const userId = await getAuthUserId()
  try {
    const [record] = await db
      .insert(searchHistory)
      .values({
        userId,
        niche: input.niche,
        targetCountry: input.country,
        audience: input.audience,
        category: input.category,
        budgetMin: input.priceMin?.toString(),
        budgetMax: input.priceMax?.toString(),
        shippingLimit: input.shippingLimit,
        parameters: input as any,
        status: SEARCH_STATUSES.PROCESSING,
        cacheKey,
      })
      .returning()
    searchRecord = record
  } catch {
    // DB insert failed, continue with AI-only flow
  }

  try {
    const discoveryWorkflow = mastra.getWorkflow('product-discovery')
    
    const run = await discoveryWorkflow.createRun()
    const workflowResult = await run.start({
      inputData: {
        niche: input.niche,
        country: input.country,
        audience: input.audience || 'General Consumer',
        category: input.category || 'All Categories',
        priceMax: input.priceMax,
      }
    })

    console.log('Workflow result:', workflowResult)
    const finalText = workflowResult.status === 'success' ? (workflowResult.result as any).finalAnalysis : null
    console.log('Final Analysis from Workflow:', finalText)

    let parsedProducts: any[] = []
    try {
      if (!finalText) throw new Error('No analysis text returned from AI')
      const parsed = extractJsonFromText(finalText)
      if (parsed) {
        parsedProducts = parsed.analyzedProducts || parsed.products || []
      }
    } catch (parseError) {
      console.error('Failed to parse AI output:', parseError)
      parsedProducts = []
    }

    if (parsedProducts.length === 0) {
      parsedProducts = []
    }

    const savedProducts = []
    for (const product of parsedProducts) {
      let savedProduct: any = null
      
      const profitAnalysis = product.profitAnalysis || {}
      
      try {
        const [dbProduct] = await db
          .insert(productResults)
          .values({
            searchId: searchRecord?.id,
            name: product.name || product.productName || 'Unknown Product',
            description: product.description || '',
            imageUrl: product.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(product.name || 'product')}/400/400`,
            demandScore: String(product.demandScore || 0),
            profitMargin: String(profitAnalysis.profitMargin || product.profitMargin || 0),
            competitionLevel: profitAnalysis.competitionLevel || product.competitionLevel || 'Medium',
            shippingDays: product.shippingDays || 7,
            suppliersCount: (product.suppliers || []).length,
            trending: product.trending ?? true,
            costPrice: String(product.costPrice || profitAnalysis.costOfGoods || 0),
            sellingPrice: String(product.sellingPrice || profitAnalysis.sellingPrice || 0),
            aiAnalysis: {
              profitAnalysis: profitAnalysis,
              aiNotes: product.aiNotes || '',
              socialProof: product.socialProof || '',
            },
          })
          .returning()
        savedProduct = dbProduct
      } catch (insertError) {
        console.error('Failed to insert product result:', insertError)
        savedProduct = { id: `temp-${Math.random()}`, ...product }
      }

      if (savedProduct?.id) {
        if (product.suppliers) {
          for (const supplier of product.suppliers) {
            try {
              await db
                .insert(supplierLinks)
                .values({
                  productId: savedProduct.id,
                  supplierName: supplier.supplierName || 'Unknown Supplier',
                  costPrice: String(supplier.costPrice || 0),
                  shippingCost: String(supplier.shippingCost || 0),
                  shippingDays: supplier.shippingDays || 7,
                  reliabilityScore: String(supplier.reliabilityScore || 0),
                  productUrl: supplier.productUrl || '',
                  location: supplier.location || 'China',
                  categories: supplier.categories || [],
                  minOrder: supplier.minOrder || '1 unit',
                  verified: (supplier.reliabilityScore || 0) > 90,
                })
            } catch (supplierError) {
              console.error('Failed to insert supplier link:', supplierError)
            }
          }
        }
        
        if (product.competitors) {
          for (const comp of product.competitors) {
            try {
              await db
                .insert(competitors)
                .values({
                  productId: savedProduct.id,
                  sellerName: comp.sellerName || 'Unknown',
                  platform: comp.platform || 'Unknown',
                  retailPrice: String(comp.retailPrice || 0),
                  shippingPrice: String(comp.shippingPrice || 0),
                  rating: String(comp.rating || 0),
                  reviewCount: comp.reviewCount || 0
                })
            } catch (compError) {
              console.error('Failed to insert competitor link:', compError)
            }
          }
        }
      }

      savedProducts.push({ 
        ...savedProduct, 
        suppliers: product.suppliers || [],
        competitors: product.competitors || []
      })
    }

    if (searchRecord) {
      try {
        await db
          .update(searchHistory)
          .set({ status: SEARCH_STATUSES.COMPLETED })
          .where(eq(searchHistory.id, searchRecord.id))
      } catch (updateError) {
        console.error('Failed to update search status:', updateError)
      }
    }

    return { success: true, data: savedProducts, searchId: searchRecord?.id, cached: false }
  } catch (aiError: any) {
    console.error('AI workflow failed:', aiError)

    if (searchRecord) {
      try {
        await db
          .update(searchHistory)
          .set({ status: SEARCH_STATUSES.FAILED })
          .where(eq(searchHistory.id, searchRecord.id))
      } catch {
        // Skip status update errors
      }
    }

    return { success: false, data: [], searchId: searchRecord?.id, cached: false, error: 'AI workflow failed to analyze products.' }
  }
}