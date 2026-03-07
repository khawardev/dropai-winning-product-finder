import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'

export const serpApiTrendsTool = createTool({
  id: 'serpapi-trends-tool',
  description: 'Analyzes trending keywords and interest over time using Google Trends via SerpApi.',
  inputSchema: z.object({
    q: z.string().describe('Search query or niche keyword'),
    geo: z.string().optional().describe('Geographic location code (e.g., "US", "GB")'),
    data_type: z.enum(['TIMESERIES', 'RELATED_QUERIES', 'RELATED_TOPICS']).optional().default('TIMESERIES'),
    time: z.string().optional().default('today 3-m'),
  }),
  outputSchema: z.object({
    interest_over_time: z.array(z.any()).optional(),
    related_queries: z.array(z.any()).optional(),
    related_topics: z.array(z.any()).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ q, geo = 'US', data_type = 'TIMESERIES', time = 'today 3-m' }) => {
    const apiKey = process.env.SERP_API_KEY
    if (!apiKey) {
      console.log('No SERP_API_KEY found, using mock data for Trends.')
      try {
        const mockDataPath = path.join(process.cwd(), 'docs', 'Apis', 'responses', 'serpapi-trends.json')
        const mockData = JSON.parse(await fs.readFile(mockDataPath, 'utf-8'))
        return {
          interest_over_time: mockData.interest_over_time?.timeline_data,
          related_queries: mockData.related_queries?.top || mockData.related_queries?.rising || [],
          related_topics: mockData.related_topics?.top,
        }
      } catch (err) {
        console.error('Failed to read mock data:', err)
      }
    }

    try {
      const url = new URL('https://serpapi.com/search.json')
      url.searchParams.append('engine', 'google_trends')
      url.searchParams.append('q', q)
      url.searchParams.append('geo', geo)
      url.searchParams.append('data_type', data_type)
      url.searchParams.append('date', time)
      url.searchParams.append('api_key', apiKey!)

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(`SerpApi request failed with status ${response.status}: ${await response.text()}`)
      }

      const data = await response.json()
      
      return {
        interest_over_time: data.interest_over_time?.timeline_data,
        related_queries: data.related_queries?.top,
        related_topics: data.related_topics?.top,
      }
    } catch (error: any) {
      console.error('SerpApi trends tool error:', error)
      return { error: error.message || 'Unknown error occurred during SerpApi request' }
    }
  },
})
