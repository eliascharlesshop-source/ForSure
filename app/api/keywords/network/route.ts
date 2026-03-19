// API endpoint for keyword network analysis
// GET /api/keywords/network

import { NextRequest, NextResponse } from 'next/server';
import { getKeywordNetwork } from '../../../lib/keyword-search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword parameter is required' },
        { status: 400 }
      );
    }

    const network = getKeywordNetwork(keyword.toLowerCase());

    return NextResponse.json({
      keyword,
      network,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Network API error:', error);
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
