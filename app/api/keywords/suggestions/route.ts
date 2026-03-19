// API endpoint for keyword suggestions
// GET /api/keywords/suggestions

import { NextRequest, NextResponse } from 'next/server';
import { getKeywordSuggestions } from '../../../lib/keyword-search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partial = searchParams.get('partial');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!partial) {
      return NextResponse.json(
        { error: 'Partial query parameter is required' },
        { status: 400 }
      );
    }

    const suggestions = getKeywordSuggestions(partial, limit);

    return NextResponse.json({
      partial,
      suggestions,
      total: suggestions.length,
      limit
    });
  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
