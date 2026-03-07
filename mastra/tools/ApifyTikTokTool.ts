import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'

export const apifyTikTokTool = createTool({
  id: 'apify-tiktok-tool',
  description: 'Scrapes trending videos and hashtags from TikTok via Apify, helping detect viral product signals.',
  inputSchema: z.object({
    hashtags: z.array(z.string()).describe('Array of hashtags (e.g., ["dogproducts", "amazonfinds"])'),
    num: z.number().optional().default(10).describe('Max results per hashtag'),
    region: z.string().optional().default('US').describe('Target region'),
  }),
  outputSchema: z.object({
    trending_vids: z.array(z.any()).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ hashtags, num = 10, region = 'US' }) => {
    const apifyToken = process.env.APIFY_TOKEN
    if (!apifyToken) {
      console.log('No APIFY_TOKEN found, using mock data for TikTok.')
      try {
        const mockDataPath = path.join(process.cwd(), 'docs', 'Apis', 'responses', 'apify-tiktok.json')
        const mockData = JSON.parse(await fs.readFile(mockDataPath, 'utf-8'))
        return { trending_vids: mockData.slice(0, num) }
      } catch (err) {
        console.error('Failed to read mock data:', err)
      }
    }

    try {
      const response = await fetch(`https://api.apify.com/v2/acts/clockworks~tiktok-hashtag-scraper/run-sync-get-dataset-items?token=${apifyToken!}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hashtags,
          resultsPerPage: num,
          shouldDownloadVideos: false,
          shouldDownloadCovers: true,
          proxyConfiguration: { useApifyProxy: true }
        })
      })

      if (!response.ok) {
        throw new Error(`Apify request failed with status ${response.status}`)
      }

      const items = await response.json()
      
      return { trending_vids: items }
    } catch (error: any) {
      console.error('Apify TikTok tool error:', error)
      return { error: error.message || 'Unknown error occurred during TikTok scraping' }
    }
  },
})
