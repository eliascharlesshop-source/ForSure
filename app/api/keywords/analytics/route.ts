// API endpoint for keyword analytics
// GET /api/keywords/analytics

import { NextRequest, NextResponse } from 'next/server';
import { getKeywordAnalytics } from '../../../lib/keyword-search';

export async function GET(request: NextRequest) {
  try {
    const analytics = getKeywordAnalytics();

    return NextResponse.json({
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
