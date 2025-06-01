import Link from "next/link";
import { Button } from "@jiwonme/jds";

// 임시 블로그 포스트 데이터
const blogPosts = [
  {
    id: 1,
    title: "Next.js 14와 App Router로 블로그 만들기",
    excerpt: "최신 Next.js 14의 App Router를 사용하여 개발 블로그를 구축하는 과정을 소개합니다. 파일 기반 라우팅부터 서버 컴포넌트까지 자세히 알아봅니다.",
    date: "2024-01-15",
    slug: "nextjs-14-blog-setup",
    tags: ["Next.js", "React", "TypeScript"],
    readTime: "8분",
  },
  {
    id: 2,
    title: "Turborepo로 모노레포 구성하기",
    excerpt: "여러 프로젝트를 효율적으로 관리할 수 있는 Turborepo 모노레포 설정 방법을 알아봅니다. 패키지 간 의존성 관리와 빌드 최적화까지 다룹니다.",
    date: "2024-01-10",
    slug: "turborepo-monorepo-setup",
    tags: ["Turborepo", "Monorepo", "DevOps"],
    readTime: "12분",
  },
  {
    id: 3,
    title: "TypeScript 5.0 새로운 기능들",
    excerpt: "TypeScript 5.0에서 추가된 새로운 기능들과 개선사항들을 살펴봅니다. const assertions, template literal types 등의 활용법을 예제와 함께 설명합니다.",
    date: "2024-01-05",
    slug: "typescript-5-new-features",
    tags: ["TypeScript", "JavaScript"],
    readTime: "10분",
  },
  {
    id: 4,
    title: "React Server Components 완전 정복",
    excerpt: "React Server Components의 동작 원리와 실제 프로젝트에서의 활용 방법을 자세히 알아봅니다. 클라이언트 컴포넌트와의 차이점과 최적화 전략까지 다룹니다.",
    date: "2023-12-28",
    slug: "react-server-components-guide",
    tags: ["React", "Next.js", "Performance"],
    readTime: "15분",
  },
  {
    id: 5,
    title: "Tailwind CSS 디자인 시스템 구축하기",
    excerpt: "Tailwind CSS를 활용하여 일관성 있는 디자인 시스템을 구축하는 방법을 소개합니다. 커스텀 컴포넌트 라이브러리 제작까지 단계별로 설명합니다.",
    date: "2023-12-20",
    slug: "tailwind-design-system",
    tags: ["Tailwind CSS", "Design System", "UI/UX"],
    readTime: "11분",
  },
];

const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

export default function BlogPage() {
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