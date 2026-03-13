'use server'

import { db } from '@/server/db'
import { winningProducts } from '@/server/db/schema/schema'
import { getAuthUserId } from '@/lib/server-session'
import { eq, desc, sql, count } from 'drizzle-orm'

export async function getDashboardStats() {
  try {
    const userId = await getAuthUserId();
    const whereClause = userId ? eq(winningProducts.userId, userId) : undefined;

    const [statsCount, revenueResult, recentProductsFetch] = await Promise.all([
      db.select({ value: count() }).from(winningProducts).where(whereClause),
      db.select({
        totalRevenue: sql<number>`SUM(CAST((${winningProducts.pipelineData}->'profitability'->>'grossMargin') AS NUMERIC)) * 100`
      })
      .from(winningProducts)
      .where(whereClause),
      db.select({
        id: winningProducts.id,
        keyword: winningProducts.keyword,
        pipelineData: winningProducts.pipelineData,
        region: winningProducts.region,
        createdAt: winningProducts.createdAt,
      })
      .from(winningProducts)
      .where(whereClause)
      .orderBy(desc(winningProducts.createdAt))
      .limit(20)
    ]);

    const totalSaved = statsCount[0]?.value || 0;
    const totalRevenuePotential = Number(revenueResult[0]?.totalRevenue || 0);

    const recentItems = recentProductsFetch.slice(0, 5).map((p: any) => {
      const pipeline = p.pipelineData || {};
      const stats = pipeline.marketIntelligence || {};
      const profit = pipeline.profitability || {};
      
      return {
        id: p.id,
        name: p.keyword,
        demandScore: stats.demandScore || 85,
        profitMargin: profit.marginPercent || 0,
        trending: stats.growthTrend === 'Rising' || stats.growthTrend === 'Breakout',
        timestamp: p.createdAt,
      };
    });

    const activeSuppliersSet = new Set();
    const regionCounts: Record<string, number> = {};

    recentProductsFetch.forEach((p: any) => {
      // Suppliers check
      const suppliers = p.pipelineData?.suppliers?.suppliers || [];
      suppliers.forEach((s: any) => {
        if (s.is_verified && s.link) {
          activeSuppliersSet.add(s.link.split('?')[0]);
        }
      });

      // Region aggregation
      const region = p.region || 'Global';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    const totalRecent = recentProductsFetch.length || 1;
    const categoryData = Object.entries(regionCounts)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / totalRecent) * 100),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    return {
      success: true,
      data: {
        productsAnalyzed: totalSaved,
        activeSuppliers: activeSuppliersSet.size,
        savedProducts: totalSaved,
        potentialRevenue: totalRevenuePotential,
        trendData: recentProductsFetch.slice(0, 7).reverse().map((p: any) => ({
          name: new Date(p.createdAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: p.pipelineData?.profitability?.marginPercent || 0,
        })),
        recentProducts: recentItems,
        categoryData,
      },
    };
  } catch (error) {
    console.error('Failed to get dashboard stats:', error);
    return {
      success: false,
      data: {
        productsAnalyzed: 0,
        activeSuppliers: 0,
        savedProducts: 0,
        potentialRevenue: 0,
        trendData: [],
        recentProducts: [],
        categoryData: [],
      },
    };
  }
}
