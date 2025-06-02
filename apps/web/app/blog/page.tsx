import Link from "next/link";
import { Button } from "@jiwonme/jds";
import { getBlogPosts, getAllTags } from "../../lib/blog";
import { BlogPost } from "../../types/blog";
import { DebugPanel } from "../../components/debug-panel";

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
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  
  // Fetch blog posts and tags
  const [allPosts, allTags] = await Promise.all([
    getBlogPosts(),
    getAllTags(),
  ]);

  // Filter posts by tag if specified
  const posts = tag 
    ? allPosts.filter((post: BlogPost) => post.tags.includes(tag))
    : allPosts;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-wanted">
              블로그
            </h1>
            <p className="text-lg text-muted-foreground font-wanted">
              개발과 기술에 대한 이야기를 나눕니다
            </p>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                <Link href="/blog">
                  <Button 
                    variant={!tag ? "default" : "outline"} 
                    size="sm" 
                    className="font-wanted"
                  >
                    전체
                  </Button>
                </Link>
                {allTags.map((tagName: string) => (
                  <Link key={tagName} href={`/blog?tag=${encodeURIComponent(tagName)}`}>
                    <Button 
                      variant={tag === tagName ? "default" : "outline"} 
                      size="sm" 
                      className="font-wanted"
                    >
                      {tagName}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Current Filter Display */}
          {tag && (
            <div className="mb-8 text-center">
              <p className="text-muted-foreground font-wanted">
                <span className="font-semibold">"{tag}"</span> 태그로 필터링된 포스트 ({posts.length}개)
              </p>
            </div>
          )}

          {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: BlogPost) => (
                <article
                  key={post.id}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tagName: string) => (
                          <Link
                            key={tagName}
                            href={`/blog?tag=${encodeURIComponent(tagName)}`}
                            className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary border border-primary/20 font-wanted hover:bg-primary/20 transition-colors"
                          >
                            {tagName}
                          </Link>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground font-wanted">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors font-wanted line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-3 font-wanted">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground font-wanted">
                      <time>
                        {new Date(post.date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <span>{post.readTime} 읽기</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground font-wanted">
                {tag ? `"${tag}" 태그의 포스트가 없습니다` : '포스트가 없습니다'}
              </h3>
              <p className="text-muted-foreground font-wanted">
                {tag ? (
                  <>
                    다른 태그를 선택하거나{' '}
                    <Link href="/blog" className="text-primary hover:underline">
                      전체 포스트
                    </Link>
                    를 확인해보세요.
                  </>
                ) : (
                  '곧 새로운 포스트가 업데이트될 예정입니다.'
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Debug Panel - Only visible in development */}
      <DebugPanel 
        data={{
          posts: posts,
          allTags: allTags,
          currentTag: tag,
          stats: {
            totalPosts: allPosts.length,
            filteredPosts: posts.length,
            totalTags: allTags.length,
          }
        }} 
        title="Blog Posts Data"
      />
    </div>
  );
} 