import { NextRequest, NextResponse } from 'next/server';
import { searchBookSegments } from '@/lib/actions/book.actions';


// Helper function to process book search logic
async function processBookSearch(bookId: unknown, query: unknown) {
  // Validate inputs before conversion to prevent null/undefined becoming "null"/"undefined" strings
  if (bookId == null || query == null || query === '') {
    return { result: 'Missing bookId or query' };
  }

  // Convert bookId to string
  const bookIdStr = String(bookId);
  const queryStr = String(query).trim();

  // Additional validation after conversion
  if (!bookIdStr || bookIdStr === 'null' || bookIdStr === 'undefined' || !queryStr) {
    return { result: 'Missing bookId or query' };
  }

  // Execute search
  const searchResult = await searchBookSegments(bookIdStr, queryStr, 3);

  // Return results
  if (!searchResult.success || !searchResult.data?.length) {
    return { result: 'No information found about this topic in the book.' };
  }

  const combinedText = searchResult.data
    .map((segment) => (segment as { content: string }).content)
    .join('\n\n');

  return { result: combinedText };

}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const toolCalls = body.tool_calls || [];
    const results = [];

    for (const tc of toolCalls) {
      if (tc.name === 'search book') {
        const { bookId, query } = tc.parameters || {};
        if (bookId && query) {
          const result = await searchBookSegments(bookId, query, 3);
          results.push({
            tool_call_id: tc.id,
            result
          });
        }
      }
    }

    return NextResponse.json({ tool_calls: results });
  } catch (e) {
    console.error('Vapi search-book error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
