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

    const response = NextResponse.json({
      blogPosts: filteredPosts,
      allTags,
      searchQuery: searchQuery || null,
      totalCount: blogPosts.length,
      filteredCount: filteredPosts.length
    });

    // 강력한 캐싱 헤더 설정
    // 검색 쿼리가 없는 경우 더 긴 캐싱
    const cacheMaxAge = searchQuery ? 300 : 1800; // 검색: 5분, 일반: 30분
    const staleWhileRevalidate = searchQuery ? 600 : 3600; // 검색: 10분, 일반: 1시간
    
    response.headers.set(
      'Cache-Control',
      `public, s-maxage=${cacheMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`
    );
    
    // ETag 설정 (데이터 변경 감지용)
    const etag = `"${Buffer.from(JSON.stringify({ 
      count: blogPosts.length, 
      lastModified: blogPosts[0]?.date || new Date().toISOString() 
    })).toString('base64')}"`;
    response.headers.set('ETag', etag);
    
    // Vary 헤더 설정 (검색 쿼리에 따른 캐싱 구분)
    response.headers.set('Vary', 'Accept-Encoding');

    return response;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog data' },
      { status: 500 }
    );
  }
} 