import { NextRequest, NextResponse } from 'next/server';

// Base API URL
const API_BASE_URL = 'https://mochien-server-release.mochidemy.com/api/v5.0';

// API headers for authentication - these won't have browser-added Origin/Referer
const API_HEADERS = {
  'privatekey': 'M0ch1M0ch1_En_$ecret_k3y',
  'Origin': 'https://mochien.com',
  'Referer': 'https://mochien.com/dictionary',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

export async function GET(request: NextRequest) {
  try {
    // Extract query params from the incoming request
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key') || '';
    const language = searchParams.get('language') || 'vi';
    
    // Forward the request to the actual API
    const response = await fetch(
      `${API_BASE_URL}/words/dictionary-english?language=${language}&key=${encodeURIComponent(key)}&type=web&definition=0`,
      {
        headers: API_HEADERS,
        cache: 'no-store' // Don't cache the response
      }
    );
    
    // Get the response data
    const data = await response.json();
    
    // Return the response to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in dictionary API route:', error);
    return NextResponse.json({ error: 'Failed to fetch data from dictionary API' }, { status: 500 });
  }
}
