import { NextRequest, NextResponse } from 'next/server';
import { getGoogleTrends } from '@/lib/serpapi';

export async function GET(req: NextRequest) {
  try {
    const keyword = req.nextUrl.searchParams.get('q');
    
    if (!keyword) {
      return NextResponse.json({ error: 'Missing keyword parameter "q"' }, { status: 400 });
    }

    const data = await getGoogleTrends(keyword);
    
    // Process and extract what we need
    const relatedQueries = data.related_queries;
    
    if (!relatedQueries) {
      return NextResponse.json({ 
        message: 'No related queries found for this term.',
        rising: [],
        top: []
      });
    }

    // Filter rising queries for "Breakout" or highly growing items
    const rising = relatedQueries.rising || [];
    const top = relatedQueries.top || [];

    // Filter "Breakout" or high percentage queries (e.g. over 500%)
    const breakoutQueries = rising.filter((item: any) => 
      item.value === 'Breakout' || (item.extracted_value && item.extracted_value >= 500)
    );

    return NextResponse.json({
      original_keyword: keyword,
      breakouts: breakoutQueries,
      rising: rising,
      top: top,
      raw_data: data
    });
    
  } catch (error: any) {
    console.error('Error in trends route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trend data', details: error.message },
      { status: 500 }
    );
  }
}
