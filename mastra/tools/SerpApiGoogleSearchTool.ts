import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'

export const serpApiGoogleSearchTool = createTool({
  id: 'serpapi-google-search-tool',
  description: 'Performs a general Google Search via SerpApi, useful for finding competitor websites, Shopify stores, and general web information.',
  inputSchema: z.object({
    q: z.string().describe('Search query (e.g., intitle:"product name" site:myshopify.com)'),
    location: z.string().optional().describe('Geographic location for results'),
    num: z.number().optional().default(10).describe('Number of results to return'),
  }),
  outputSchema: z.object({
    organic_results: z.array(z.any()).optional(),
    related_questions: z.array(z.any()).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ q, location = 'United States', num = 10 }) => {
    const apiKey = process.env.SERP_API_KEY
    if (!apiKey) {
      console.log('No SERP_API_KEY found, using mock data for Google Search.')
      try {
        const mockDataPath = path.join(process.cwd(), 'docs', 'Apis', 'responses', 'serpapi-google-search.json')
        const mockData = JSON.parse(await fs.readFile(mockDataPath, 'utf-8'))
        return {
          organic_results: mockData.organic_results,
          related_questions: mockData.related_questions,
        }
      } catch (err) {
        console.error('Failed to read mock data:', err)
      }
    }

    try {
      const url = new URL('https://serpapi.com/search.json')
      url.searchParams.append('engine', 'google')
      url.searchParams.append('q', q)
      url.searchParams.append('api_key', apiKey!)
      url.searchParams.append('num', num.toString())
      if (location) url.searchParams.append('location', location)

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(`SerpApi request failed with status ${response.status}`)
      }

      const data = await response.json()
      
      return {
        organic_results: data.organic_results,
        related_questions: data.related_questions,
      }
    } catch (error: any) {
      console.error('SerpApi google search tool error:', error)
      return { error: error.message || 'Unknown error occurred during SerpApi request' }
    }
  },
})
