import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@jiwonme/jds";
import { MarkdownRenderer } from "../../../components/markdown-renderer";
import { DebugPanel } from "../../../components/debug-panel";
import { getBlogPost } from "../../../lib/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch the blog post from Notion
  const post = await getBlogPost(slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background scroll-smooth" id="top">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="font-wanted">
                ← 블로그로 돌아가기
              </Button>
            </Link>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-12">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
                loading="eager"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-12">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary border border-primary/20 font-wanted hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground font-wanted">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                <p className="text-lg text-muted-foreground italic font-wanted leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 font-wanted">
              <time className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime} 읽기
              </span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {post.tags.length}개 태그
                  </span>
                </>
              )}
            </div>
          </header>

          {/* Article Content */}
          <article className="mb-16">
            {/* Content wrapper with better typography and Notion-specific styling */}
            <div className="leading-relaxed notion-content">
              <MarkdownRenderer 
                content={post.content} 
                className="text-base md:text-lg leading-7 md:leading-8"
              />
            </div>
          </article>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground font-wanted mr-2">태그:</span>
                  {post.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors font-wanted"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex gap-3">
                <Link href="/blog">
                  <Button variant="outline" className="font-wanted">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    더 많은 포스트
                  </Button>
                </Link>
                <a href="#top" className="inline-flex">
                  <Button variant="default" className="font-wanted">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    맨 위로
                  </Button>
                </a>
              </div>
            </div>

            {/* Additional metadata for Notion content */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="text-xs text-muted-foreground font-wanted text-center">
                <p>이 포스트는 Notion에서 작성되어 자동으로 동기화되었습니다.</p>
                {post.date && (
                  <p className="mt-1">
                    마지막 업데이트: {new Date(post.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Debug Panel - Only visible in development */}
      <DebugPanel 
        data={post} 
        title={`Blog Post: ${post.title}`}
      />
    </div>
  );
} 