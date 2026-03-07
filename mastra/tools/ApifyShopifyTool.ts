import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'

export const apifyShopifyTool = createTool({
  id: 'apify-shopify-tool',
  description: 'Scrapes direct competitor product info from Shopify stores via Apify to calculate market averages.',
  inputSchema: z.object({
    storeUrl: z.string().describe('URL of the Shopify store to scrape'),
    limit: z.number().optional().default(10).describe('Max products to extract'),
  }),
  outputSchema: z.object({
    competitorProducts: z.array(z.any()).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ storeUrl, limit = 10 }) => {
    const apifyToken = process.env.APIFY_TOKEN
    if (!apifyToken) {
      console.log('No APIFY_TOKEN found, using mock data for Shopify.')
      try {
        const mockDataPath = path.join(process.cwd(), 'docs', 'Apis', 'responses', 'apify-shopify-retry.json')
        const mockData = JSON.parse(await fs.readFile(mockDataPath, 'utf-8'))
        return { competitorProducts: mockData.slice(0, limit) }
      } catch (err) {
        console.error('Failed to read mock data:', err)
      }
    }

    try {
      const response = await fetch(`https://api.apify.com/v2/acts/dhrumil~shopify-products-scraper/run-sync-get-dataset-items?token=${apifyToken!}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startUrls: [{ url: storeUrl }],
          maxItems: limit,
          proxyConfiguration: { useApifyProxy: true }
        })
      })

      if (!response.ok) {
        throw new Error(`Apify Shopify request failed with status ${response.status}: ${await response.text()}`)
      }

      const products = await response.json()
      
      return { competitorProducts: products }
    } catch (error: any) {
      console.error('Apify Shopify tool error:', error)
      return { error: error.message || 'Unknown error occurred during Shopify scraping' }
    }
  },
})
