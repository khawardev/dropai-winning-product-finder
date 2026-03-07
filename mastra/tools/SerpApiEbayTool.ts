import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'

export const serpApiEbayTool = createTool({
  id: 'serpapi-ebay-tool',
  description: 'Searches eBay listings via SerpApi to find competitor pricing and availability.',
  inputSchema: z.object({
    _nkw: z.string().describe('Search query for eBay (e.g. product name)'),
    ebay_domain: z.string().optional().default('ebay.com').describe('eBay domain to search on'),
  }),
  outputSchema: z.object({
    organic_results: z.array(z.any()).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ _nkw, ebay_domain = 'ebay.com' }) => {
    const apiKey = process.env.SERP_API_KEY
    if (!apiKey) {
      console.log('No SERP_API_KEY found, using mock data for eBay.')
      try {
        const mockDataPath = path.join(process.cwd(), 'docs', 'Apis', 'responses', 'serpapi-shopping.json')
        const mockData = JSON.parse(await fs.readFile(mockDataPath, 'utf-8'))
        return {
          organic_results: mockData.shopping_results || mockData.categorized_shopping_results?.[0]?.shopping_results || [],
        }
      } catch (err) {
        console.error('Failed to read mock data:', err)
      }
    }

    try {
      const url = new URL('https://serpapi.com/search.json')
      url.searchParams.append('engine', 'ebay')
      url.searchParams.append('_nkw', _nkw)
      url.searchParams.append('ebay_domain', ebay_domain)
      url.searchParams.append('api_key', apiKey!)

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(`SerpApi request failed with status ${response.status}`)
      }

      const data = await response.json()
      
      return {
        organic_results: data.organic_results,
      }
    } catch (error: any) {
      console.error('SerpApi eBay tool error:', error)
      return { error: error.message || 'Unknown error occurred during SerpApi request' }
    }
  },
})
