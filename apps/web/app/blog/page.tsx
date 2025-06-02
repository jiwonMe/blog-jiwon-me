import { getBlogPosts, getAllTags } from "../../lib/blog";
import { BlogPageClient } from "./blog-page-client";

// 정적 생성 설정 - 1시간마다 재생성
export const revalidate = 3600;

// 메타데이터 설정
export const metadata = {
  title: '블로그 - 지원의 개발 블로그',
  description: '개발하면서 배운 것들과 경험을 기록하고 공유합니다.',
  openGraph: {
    title: '블로그 - 지원의 개발 블로그',
    description: '개발하면서 배운 것들과 경험을 기록하고 공유합니다.',
    type: 'website',
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  // searchParams를 await로 처리
  const params = await searchParams;
  
  // 서버에서 데이터 페칭 (빌드 타임 또는 ISR)
  const [blogPosts, allTags] = await Promise.all([
    getBlogPosts(),
    getAllTags()
  ]);

  // 검색 쿼리 처리
  const searchQuery = params.search || "";
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

  return (
    <BlogPageClient 
      initialPosts={filteredPosts}
      allPosts={blogPosts}
      allTags={allTags}
      initialSearchQuery={searchQuery}
    />
  );
} 