import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    // Validate that the URL is from Notion or AWS (for security)
    const url = new URL(imageUrl);
    const allowedHosts = [
      'notion.so',
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'images.unsplash.com', // Notion sometimes uses Unsplash
    ];

    const isAllowed = allowedHosts.some(host => 
      url.hostname === host || url.hostname.endsWith(`.${host}`)
    );

    if (!isAllowed) {
      return new NextResponse('Unauthorized URL', { status: 403 });
    }

    // Fetch the image
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Blog Image Proxy)',
      },
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 