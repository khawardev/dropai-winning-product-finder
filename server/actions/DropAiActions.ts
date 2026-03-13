'use server'

import { db } from '@/server/db'
import { winningProducts } from '@/server/db/schema/schema'
import { getAuthUserId } from '@/lib/server-session'

export async function analyzeAndSaveWinningProduct(payload: {
  keyword: string;
  region: string;
  timeframe: string;
  pipelineData: any;
  imageUrl?: string;
}) {
  const userId = await getAuthUserId();
  if (!userId) {
    return { success: false, error: 'User is not authenticated.' };
  }

  try {
    const finalPipelineData = {
      ...payload.pipelineData,
      imageUrl: payload.imageUrl || payload.pipelineData.imageUrl
    };

    const [inserted] = await db.insert(winningProducts).values({
      userId,
      keyword: payload.keyword,
      region: payload.region,
      timeframe: payload.timeframe,
      pipelineData: finalPipelineData,
    }).returning({ id: winningProducts.id });

    return { success: true, productId: inserted.id };
  } catch (error) {
    console.error('Failed to save winning product:', error);
    return { success: false, error: 'Failed to save winning product data.' };
  }
}

