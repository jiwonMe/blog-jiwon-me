import { NextResponse, NextRequest } from 'next/server';
import { getBlogPosts, getAllTags } from '../../../lib/blog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');

    const [blogPosts, allTags] = await Promise.all([
      getBlogPosts(),
      getAllTags()
    ]);

    // 검색 쿼리가 있으면 필터링
    let filteredPosts = blogPosts;
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredPosts = blogPosts.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const excerptMatch = post.excerpt.toLowerCase().includes(query);
        const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
        
        return titleMatch || excerptMatch || tagMatch;
      });
    }

    return NextResponse.json({
      blogPosts: filteredPosts,
      allTags,
      searchQuery: searchQuery || null,
      totalCount: blogPosts.length,
      filteredCount: filteredPosts.length
    });
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog data' },
      { status: 500 }
    );
  }
} 