import Link from "next/link";
import Image from "next/image";
import { Button } from "@jiwonme/jds";
import { getBlogPosts, getAllTags } from "../../lib/blog";
import { ThumbnailPlaceholder } from "../../components/thumbnail-placeholder";

export default async function BlogPage() {
  // Fetch blog posts from Notion
  const blogPosts = await getBlogPosts();
  const allTags = await getAllTags();
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">블로그</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          개발하면서 배운 것들과 경험을 기록하고 공유합니다.
        </p>
      </div>

      {/* Tags Filter */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">태그별 필터</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            전체
          </Button>
          {allTags.map((tag) => (
            <Button key={tag} variant="ghost" size="sm">
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts */}
      <div className="space-y-6">
        {blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">아직 게시된 포스트가 없습니다.</p>
          </div>
        ) : (
          blogPosts.map((post) => (
            <article
              key={post.id}
              className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="sm:w-48 sm:h-32 aspect-video sm:aspect-auto overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 relative">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 192px"
                    />
                  ) : (
                    <ThumbnailPlaceholder 
                      title={post.title}
                      tags={post.tags}
                      size="sm"
                      className="w-full h-full"
                    />
                  )}
                </div>
                
                <div className="p-4 sm:p-6 flex flex-col space-y-3 flex-1 min-w-0">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <time>
                        {new Date(post.date).toLocaleDateString('ko-KR')}
                      </time>
                      <span>•</span>
                      <span>{post.readTime} 읽기</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-medium text-primary hover:underline flex-shrink-0"
                    >
                      계속 읽기 →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Pagination or Load More */}
      {blogPosts.length > 0 && (
        <div className="text-center mt-12">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              총 {blogPosts.length}개의 포스트
            </p>
            {blogPosts.length >= 10 && (
              <Button variant="outline" size="lg">
                더 많은 포스트 보기
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 