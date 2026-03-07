import { db } from '@/server/db'
import { searchHistory } from '@/server/db/schema/schema'
import { getAuthUserId } from '@/lib/server-session'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recent = await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(desc(searchHistory.createdAt))
      .limit(5)

    return NextResponse.json(recent)
  } catch (error) {
    console.error('Failed to fetch recent searches:', error)
    return NextResponse.json([], { status: 500 })
  }
}
