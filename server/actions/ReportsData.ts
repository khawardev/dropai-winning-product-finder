'use server'

import { db } from '@/server/db'
import { winningProducts } from '@/server/db/schema/schema'
import { desc } from 'drizzle-orm'

export async function getReportsData() {
  try {
    const products = await db
      .select({
        keyword: winningProducts.keyword,
        region: winningProducts.region,
        pipelineData: winningProducts.pipelineData,
        createdAt: winningProducts.createdAt,
      })
      .from(winningProducts)
      .orderBy(desc(winningProducts.createdAt))
      .limit(50);

    const trends = products.map((p: any) => ({
      name: p.keyword,
      value: p.pipelineData?.profitability?.marginPercent || 0,
      profit: p.pipelineData?.profitability?.grossMargin || 0,
      competition: p.pipelineData?.profitability?.verdict || 'Medium',
    }));

    const margins = products.map((p: any) => p.pipelineData?.profitability?.marginPercent || 0);
    const profitDistribution = [
      { name: 'Under 20%', value: margins.filter(m => m < 20).length },
      { name: '20-40%', value: margins.filter(m => m >= 20 && m < 40).length },
      { name: 'Over 40%', value: margins.filter(m => m >= 40).length },
    ].filter(item => item.value > 0);

    const commonRegions = products.reduce((acc: any, p: any) => {
      acc[p.region] = (acc[p.region] || 0) + 1;
      return acc;
    }, {});

    const nicheData = Object.entries(commonRegions).map(([name, value]) => ({
      name,
      value: Number(value),
    }));

    return {
      success: true,
      data: {
        nicheData,
        profitDistribution,
        recentTrends: trends,
      },
    };
  } catch (error) {
    console.error('Failed to get reports data:', error);
    return {
      success: false,
      data: {
        nicheData: [],
        profitDistribution: [],
        recentTrends: [],
      },
    };
  }
}
