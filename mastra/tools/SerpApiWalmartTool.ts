import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'

export const serpApiWalmartTool = createTool({
  id: 'serpapi-walmart-tool',
  description: 'Searches Walmart listings via SerpApi to find competitor pricing and availability.',
  inputSchema: z.object({
    query: z.string().describe('Search query for Walmart (e.g. product name)'),
  }),
  outputSchema: z.object({
    organic_results: z.array(z.any()).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ query }) => {
    const apiKey = process.env.SERP_API_KEY
    if (!apiKey) {
      console.log('No SERP_API_KEY found, using mock data for Walmart.')
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
      url.searchParams.append('engine', 'walmart')
      url.searchParams.append('query', query)
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
      console.error('SerpApi Walmart tool error:', error)
      return { error: error.message || 'Unknown error occurred during SerpApi request' }
    }
  },
})
