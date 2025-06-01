import Link from "next/link";
import { Button } from "@jiwonme/jds";
import { getBlogPosts, getAllTags } from "../../lib/blog";

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
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="group border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p className="text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <time>
                    {new Date(post.date).toLocaleDateString('ko-KR')}
                  </time>
                  <span>•</span>
                  <span>{post.readTime} 읽기</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  계속 읽기 →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          더 많은 포스트 보기
        </Button>
      </div>
    </div>
  );
} 