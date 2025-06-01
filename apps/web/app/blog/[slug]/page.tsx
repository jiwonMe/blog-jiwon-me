import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@jiwonme/jds";
import { MarkdownRenderer } from "../../../components/markdown-renderer";
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
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              ← 블로그로 돌아가기
            </Button>
          </Link>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
            <time>
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>•</span>
            <span>{post.readTime} 읽기</span>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <MarkdownRenderer content={post.content} />
        </article>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <Link href="/blog">
              <Button variant="outline">
                더 많은 포스트 보기
              </Button>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
} 