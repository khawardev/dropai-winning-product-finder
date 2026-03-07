'use server'

import { db } from '@/server/db'
import { productResults } from '@/server/db/schema/schema'
import { sql, desc } from 'drizzle-orm'

export async function getReportsData() {
  try {
    const nicheData = await db
      .select({
        niche: sql<string>`COALESCE(${productResults.competitionLevel}, 'Medium')`,
        count: sql<number>`COUNT(*)`,
        avgDemand: sql<number>`ROUND(AVG(CAST(${productResults.demandScore} AS NUMERIC)), 1)`,
      })
      .from(productResults)
      .groupBy(sql`${productResults.competitionLevel}`)

    const profitDistribution = await db
      .select({
        range: sql<string>`
          CASE
            WHEN CAST(${productResults.profitMargin} AS NUMERIC) < 20 THEN '10-20%'
            WHEN CAST(${productResults.profitMargin} AS NUMERIC) < 30 THEN '20-30%'
            WHEN CAST(${productResults.profitMargin} AS NUMERIC) < 40 THEN '30-40%'
            WHEN CAST(${productResults.profitMargin} AS NUMERIC) < 50 THEN '40-50%'
            ELSE '50%+'
          END
        `,
        count: sql<number>`COUNT(*)`,
      })
      .from(productResults)
      .groupBy(sql`
        CASE
          WHEN CAST(${productResults.profitMargin} AS NUMERIC) < 20 THEN '10-20%'
          WHEN CAST(${productResults.profitMargin} AS NUMERIC) < 30 THEN '20-30%'
          WHEN CAST(${productResults.profitMargin} AS NUMERIC) < 40 THEN '30-40%'
          WHEN CAST(${productResults.profitMargin} AS NUMERIC) < 50 THEN '40-50%'
          ELSE '50%+'
        END
      `)

    const recentTrends = await db
      .select({
        name: productResults.name,
        demandScore: productResults.demandScore,
        profitMargin: productResults.profitMargin,
        competitionLevel: productResults.competitionLevel,
        discoveredAt: productResults.discoveredAt,
      })
      .from(productResults)
      .orderBy(desc(productResults.discoveredAt))
      .limit(20)

    return {
      success: true,
      data: {
        nicheData: nicheData.map((n) => ({
          name: n.niche,
          value: Number(n.count),
          avgDemand: Number(n.avgDemand),
        })),
        profitDistribution: profitDistribution.map((p) => ({
          name: p.range?.trim() || 'Unknown',
          value: Number(p.count),
        })),
        recentTrends: recentTrends.map((t) => ({
          name: t.name,
          value: Number(t.demandScore) || 0,
          profit: Number(t.profitMargin) || 0,
          competition: t.competitionLevel || 'Medium',
        })),
      },
    }
  } catch (error) {
    console.error('Failed to get reports data:', error)
    return {
      success: true,
      data: {
        nicheData: [],
        profitDistribution: [],
        recentTrends: [],
      },
    }
  }
}
