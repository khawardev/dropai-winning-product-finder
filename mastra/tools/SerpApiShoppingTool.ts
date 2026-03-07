import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'

export const serpApiShoppingTool = createTool({
  id: 'serpapi-shopping-tool',
  description: 'Searches e-commerce products and listings on Google Shopping via SerpApi, providing real-time pricing and seller details.',
  inputSchema: z.object({
    q: z.string().describe('Product search query or niche'),
    direct_link: z.string().optional().describe('Direct link to a product if available'),
    location: z.string().optional().describe('Geographic location for results'),
    num: z.number().optional().default(10).describe('Number of results to return'),
    tbs: z.string().optional().describe('Google Shopping filters (e.g., "mr:1,price:1,ppr:10")'),
  }),
  outputSchema: z.object({
    shopping_results: z.array(z.any()).optional(),
    sellers_results: z.array(z.any()).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ q, location = 'United States', num = 10, tbs = '' }) => {
    const apiKey = process.env.SERP_API_KEY
    if (!apiKey) {
      console.log('No SERP_API_KEY found, using mock data for Shopping.')
      try {
        const mockDataPath = path.join(process.cwd(), 'docs', 'Apis', 'responses', 'serpapi-shopping.json')
        const mockData = JSON.parse(await fs.readFile(mockDataPath, 'utf-8'))
        return {
          shopping_results: mockData.shopping_results || mockData.categorized_shopping_results?.[0]?.shopping_results || [],
          sellers_results: mockData.sellers_results,
        }
      } catch (err) {
        console.error('Failed to read mock data:', err)
      }
    }

    try {
      const url = new URL('https://serpapi.com/search.json')
      url.searchParams.append('engine', 'google_shopping')
      url.searchParams.append('q', q)
      url.searchParams.append('api_key', apiKey!)
      url.searchParams.append('num', num.toString())
      if (location) url.searchParams.append('location', location)
      if (tbs) url.searchParams.append('tbs', tbs)

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(`SerpApi request failed with status ${response.status}`)
      }

      const data = await response.json()
      
      return {
        shopping_results: data.shopping_results,
        sellers_results: data.sellers_results,
      }
    } catch (error: any) {
      console.error('SerpApi shopping tool error:', error)
      return { error: error.message || 'Unknown error occurred during SerpApi request' }
    }
  },
})
