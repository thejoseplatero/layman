import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Fetch the URL content
    const urlData = await fetchUrlContent(url);
    
    const source = {
      id: Date.now().toString(),
      type: 'url' as const,
      name: urlData.title || getDomainFromUrl(url),
      url: url,
      content: urlData.content,
      summary: urlData.summary,
      title: urlData.title
    };

    return NextResponse.json({
      source,
      message: `Successfully loaded content from ${getDomainFromUrl(url)}`
    });

  } catch (error) {
    console.error('URL fetch error:', error);
    return NextResponse.json(
      { error: `Failed to fetch URL content: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (_) {
    return 'Unknown domain';
  }
}

async function fetchUrlContent(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Layman-Bot/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const html = await response.text();
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const description = descMatch ? descMatch[1] : '';

  // Remove HTML tags and extract text content
  let textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Limit content size
  if (textContent.length > 10000) {
    textContent = textContent.substring(0, 10000) + '...';
  }

  const summary = `URL: ${url}
Title: ${title}
Domain: ${getDomainFromUrl(url)}
Description: ${description}
Content length: ${textContent.length} characters`;

  return {
    title,
    content: `URL: ${url}\nTitle: ${title}\nDescription: ${description}\n\n--- Content ---\n${textContent}`,
    summary,
    description
  };
}