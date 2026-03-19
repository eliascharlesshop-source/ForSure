// API endpoint for keyword export
// GET /api/keywords/export

import { NextRequest, NextResponse } from 'next/server';
import { exportKeywords } from '../../../lib/keyword-search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get('format') || 'json') as 'json' | 'csv' | 'xml';

    if (!['json', 'csv', 'xml'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Supported formats: json, csv, xml' },
        { status: 400 }
      );
    }

    const data = exportKeywords(format);
    
    // Set appropriate content type and headers
    const contentType = format === 'json' ? 'application/json' : 
                       format === 'csv' ? 'text/csv' : 'application/xml';
    
    const response = new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="keywords.${format}"`,
        'Cache-Control': 'no-cache'
      }
    });

    return response;
  } catch (error: any) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
