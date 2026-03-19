// API endpoint for keyword categories
// GET /api/keywords/categories

import { NextRequest, NextResponse } from 'next/server';
import { getKeywordsByCategory, getHighPriorityKeywords } from '../../../lib/keyword-search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as 'dev' | 'design' | 'both' | undefined;
    const priority = searchParams.get('priority') as 'high' | 'medium' | 'low' | undefined;

    let categories;
    
    if (category) {
      categories = getKeywordsByCategory(category);
    } else {
      // Return all categories
      categories = [
        ...getKeywordsByCategory('dev'),
        ...getKeywordsByCategory('design'),
        ...getKeywordsByCategory('both')
      ];
    }

    // Filter by priority if specified
    if (priority) {
      categories = categories.map((cat: any) => ({
        ...cat,
        keywords: cat.keywords.filter((keyword: any) => keyword.priority === priority)
      })).filter((cat: any) => cat.keywords.length > 0);
    }

    return NextResponse.json({
      category,
      priority,
      categories,
      totalCategories: categories.length,
      totalKeywords: categories.reduce((sum: number, cat: any) => sum + cat.keywords.length, 0),
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
