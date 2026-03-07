import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'

export const apifyAliExpressTool = createTool({
  id: 'apify-aliexpress-tool',
  description: 'Deep-scrapes AliExpress product details and supplier info via Apify, used for detailed dropshipping supply chain research.',
  inputSchema: z.object({
    keyword: z.string().describe('Product search keyword'),
    maxItems: z.number().optional().default(10).describe('Max product results to scrap'),
    ship_to: z.string().optional().default('US').describe('Shipping destination country'),
  }),
  outputSchema: z.object({
    products: z.array(z.any()).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ keyword, maxItems = 10, ship_to = 'US' }) => {
    const apifyToken = process.env.APIFY_TOKEN
    if (!apifyToken) {
      console.log('No APIFY_TOKEN found, using mock data for AliExpress.')
      try {
        const mockDataPath = path.join(process.cwd(), 'docs', 'Apis', 'responses', 'apify-shopify-retry.json')
        const mockData = JSON.parse(await fs.readFile(mockDataPath, 'utf-8'))
        return { products: mockData.slice(0, maxItems) }
      } catch (err) {
        console.error('Failed to read mock data:', err)
      }
    }

    try {
      const response = await fetch(`https://api.apify.com/v2/acts/cloud9_ai~aliexpress-scraper/run-sync-get-dataset-items?token=${apifyToken!}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchKeyword: keyword,
          maxResults: maxItems,
          shipTo: ship_to,
          proxyConfiguration: { useApifyProxy: true }
        })
      })

      if (!response.ok) {
        throw new Error(`Apify AliExpress request failed with status ${response.status}`)
      }

      const products = await response.json()
      
      return { products }
    } catch (error: any) {
      console.error('Apify AliExpress tool error:', error)
      return { error: error.message || 'Unknown error occurred during AliExpress research' }
    }
  },
})
