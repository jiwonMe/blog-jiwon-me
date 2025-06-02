import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const tag = searchParams.get('tag');
    const path = searchParams.get('path');

    // Verify the secret token to prevent unauthorized revalidation
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate specific tag
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({
        message: `Cache invalidated for tag: ${tag}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Revalidate specific path
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        message: `Cache invalidated for path: ${path}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Revalidate all blog-related tags
    const tagsToRevalidate = [
      'notion-blog',
      'blog-posts',
      'blog-tags',
      'notion-content',
      'notion-images'
    ];

    tagsToRevalidate.forEach(tagName => {
      revalidateTag(tagName);
    });

    // Revalidate important paths
    const pathsToRevalidate = [
      '/blog',
      '/api/blog'
    ];

    pathsToRevalidate.forEach(pathName => {
      revalidatePath(pathName);
    });

    return NextResponse.json({
      message: 'All blog caches invalidated successfully',
      tags: tagsToRevalidate,
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 }
    );
  }
}

// Allow GET requests for manual testing
export async function GET(request: NextRequest) {
  return POST(request);
} 