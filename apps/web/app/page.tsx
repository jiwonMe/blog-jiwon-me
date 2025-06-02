import { Button } from "@jiwonme/jds";
import Link from "next/link";
import { getBlogPosts } from "../lib/blog";
import { ThumbnailPlaceholder } from "../components/thumbnail-placeholder";

export default async function Home() {
  // Fetch recent blog posts from Notion
  const allPosts = await getBlogPosts();
  const recentPosts = allPosts.slice(0, 3); // Get the 3 most recent posts
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          안녕하세요, <span className="text-primary">지원</span>입니다
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          프론트엔드 개발자로서 배우고 경험한 것들을 기록하고 공유하는 공간입니다.
          주로 React, TypeScript, Next.js에 대한 이야기를 다룹니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/blog">블로그 보기</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">소개 보기</Link>
          </Button>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">최근 포스트</h2>
          <Button variant="ghost" asChild>
            <Link href="/blog">모든 포스트 보기 →</Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <article
              key={post.id}
              className="group rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col">
                {/* Thumbnail */}
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ThumbnailPlaceholder 
                      title={post.title}
                      tags={post.tags}
                      size="md"
                      className="w-full h-full"
                    />
                  )}
                </div>
                
                <div className="p-6 flex flex-col space-y-3">
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
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <time className="text-sm text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('ko-KR')}
                    </time>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      읽어보기
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>


    </div>
  );
}
