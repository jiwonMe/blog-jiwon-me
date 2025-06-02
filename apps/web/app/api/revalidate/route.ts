import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const tag = searchParams.get('tag');

    // Verify the secret token to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATION_SECRET) {
      return new NextResponse('Invalid secret', { status: 401 });
    }

    if (tag) {
      // Revalidate specific tag
      revalidateTag(tag);
      return NextResponse.json({ 
        revalidated: true, 
        tag,
        now: Date.now() 
      });
    } else {
      // Revalidate all blog-related tags
      revalidateTag('notion-blog');
      revalidateTag('blog-posts');
      revalidateTag('blog-tags');
      revalidateTag('notion-content');
      revalidateTag('notion-images');
      
      return NextResponse.json({ 
        revalidated: true, 
        tags: ['notion-blog', 'blog-posts', 'blog-tags', 'notion-content', 'notion-images'],
        now: Date.now() 
      });
    }
  } catch (error) {
    console.error('Error revalidating:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Allow GET requests for manual testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.REVALIDATION_SECRET) {
    return new NextResponse('Invalid secret', { status: 401 });
  }

  return NextResponse.json({
    message: 'Use POST method to revalidate cache',
    usage: 'POST /api/revalidate?secret=YOUR_SECRET&tag=OPTIONAL_TAG'
  });
} 