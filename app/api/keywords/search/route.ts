// API endpoints for the keyword database system
// RESTful API for search, analytics, and management

import { NextRequest, NextResponse } from 'next/server';
import {
  advancedSearch,
  getKeywordSuggestions,
  getKeywordAnalytics,
  getKeywordNetwork,
  findKeywordsByContext,
  exportKeywords,
  importKeywords,
  getKeywordsByCategory,
  getHighPriorityKeywords
} from '../../../lib/keyword-search';

// GET /api/keywords/search - Search keywords
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category') as 'dev' | 'design' | 'both' | undefined;
    const subcategory = searchParams.get('subcategory');
    const priority = searchParams.get('priority') as 'high' | 'medium' | 'low' | undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeSynonyms = searchParams.get('synonyms') !== 'false';
    const includeRelated = searchParams.get('related') !== 'false';
    const fuzzySearch = searchParams.get('fuzzy') !== 'false';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const results = advancedSearch(query, {
      category,
      subcategory,
      priority,
      includeSynonyms,
      includeRelated,
      fuzzySearch,
      limit
    });

    return NextResponse.json({
      query,
      results,
      total: results.length,
      options: {
        category,
        subcategory,
        priority,
        limit,
        includeSynonyms,
        includeRelated,
        fuzzySearch
      }
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/keywords/search - Advanced search with filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      category,
      subcategory,
      priority,
      includeSynonyms = true,
      includeRelated = true,
      fuzzySearch = true,
      limit = 20
    } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const results = advancedSearch(query, {
      category,
      subcategory,
      priority,
      includeSynonyms,
      includeRelated,
      fuzzySearch,
      limit
    });

    return NextResponse.json({
      query,
      results,
      total: results.length,
      options: {
        category,
        subcategory,
        priority,
        includeSynonyms,
        includeRelated,
        fuzzySearch,
        limit
      }
    });
  } catch (error: any) {
    console.error('Advanced search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
