import { Button } from "@jiwonme/jds";
import Link from "next/link";

// 임시 블로그 포스트 데이터
const recentPosts = [
  {
    id: 1,
    title: "Next.js 14와 App Router로 블로그 만들기",
    excerpt: "최신 Next.js 14의 App Router를 사용하여 개발 블로그를 구축하는 과정을 소개합니다.",
    date: "2024-01-15",
    slug: "nextjs-14-blog-setup",
    tags: ["Next.js", "React", "TypeScript"],
  },
  {
    id: 2,
    title: "Turborepo로 모노레포 구성하기",
    excerpt: "여러 프로젝트를 효율적으로 관리할 수 있는 Turborepo 모노레포 설정 방법을 알아봅니다.",
    date: "2024-01-10",
    slug: "turborepo-monorepo-setup",
    tags: ["Turborepo", "Monorepo", "DevOps"],
  },
  {
    id: 3,
    title: "TypeScript 5.0 새로운 기능들",
    excerpt: "TypeScript 5.0에서 추가된 새로운 기능들과 개선사항들을 살펴봅니다.",
    date: "2024-01-05",
    slug: "typescript-5-new-features",
    tags: ["TypeScript", "JavaScript"],
  },
];

export default function Home() {
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
              className="group rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col space-y-3">
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
            </article>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">주요 기술 스택</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "React", "TypeScript", "Next.js", "Node.js",
            "Tailwind CSS", "Prisma", "PostgreSQL", "Vercel"
          ].map((skill) => (
            <div
              key={skill}
              className="text-center p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
            >
              <span className="font-medium">{skill}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
