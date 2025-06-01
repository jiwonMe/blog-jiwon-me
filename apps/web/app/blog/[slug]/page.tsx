import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@jiwonme/jds";

// 임시 블로그 포스트 데이터 (실제로는 CMS나 마크다운 파일에서 가져올 것)
const blogPosts = [
  {
    id: 1,
    title: "Next.js 14와 App Router로 블로그 만들기",
    content: `
# Next.js 14와 App Router로 블로그 만들기

Next.js 14의 App Router는 React Server Components를 기반으로 한 새로운 라우팅 시스템입니다. 이번 포스트에서는 App Router를 사용하여 개발 블로그를 구축하는 과정을 단계별로 살펴보겠습니다.

## App Router의 주요 특징

### 1. 파일 기반 라우팅
App Router는 \`app\` 디렉토리 내의 폴더 구조를 기반으로 라우팅을 생성합니다.

### 2. Server Components
기본적으로 모든 컴포넌트는 서버에서 렌더링되어 성능이 향상됩니다.

### 3. 레이아웃 시스템
중첩된 레이아웃을 통해 UI를 효율적으로 구성할 수 있습니다.

## 블로그 구조 설계

블로그를 만들기 위해 다음과 같은 구조를 설계했습니다:

\`\`\`
app/
├── layout.tsx          # 루트 레이아웃
├── page.tsx            # 홈페이지
├── blog/
│   ├── page.tsx        # 블로그 목록
│   └── [slug]/
│       └── page.tsx    # 개별 포스트
└── about/
    └── page.tsx        # 소개 페이지
\`\`\`

## 마무리

Next.js 14의 App Router를 사용하면 더욱 효율적이고 성능이 좋은 블로그를 만들 수 있습니다. 다음 포스트에서는 MDX를 활용한 마크다운 블로그 구현에 대해 다뤄보겠습니다.
    `,
    date: "2024-01-15",
    slug: "nextjs-14-blog-setup",
    tags: ["Next.js", "React", "TypeScript"],
    readTime: "8분",
  },
  {
    id: 2,
    title: "Turborepo로 모노레포 구성하기",
    content: `
# Turborepo로 모노레포 구성하기

모노레포(Monorepo)는 여러 프로젝트를 하나의 저장소에서 관리하는 방식입니다. Turborepo는 Vercel에서 개발한 고성능 빌드 시스템으로, JavaScript/TypeScript 모노레포를 효율적으로 관리할 수 있게 해줍니다.

## Turborepo의 장점

### 1. 빠른 빌드
캐싱과 병렬 처리를 통해 빌드 시간을 대폭 단축합니다.

### 2. 의존성 관리
패키지 간 의존성을 자동으로 분석하고 올바른 순서로 빌드합니다.

### 3. 개발 경험 향상
Hot reload와 같은 개발 도구들이 모노레포 환경에서도 원활하게 작동합니다.

## 프로젝트 구조

\`\`\`
my-turborepo/
├── apps/
│   ├── web/            # Next.js 앱
│   └── docs/           # 문서 사이트
├── packages/
│   ├── ui/             # 공유 UI 컴포넌트
│   ├── eslint-config/  # ESLint 설정
│   └── typescript-config/ # TypeScript 설정
└── turbo.json          # Turborepo 설정
\`\`\`

## 설정 방법

Turborepo를 설정하는 방법은 매우 간단합니다:

\`\`\`bash
npx create-turbo@latest
\`\`\`

## 마무리

Turborepo를 사용하면 복잡한 모노레포도 쉽게 관리할 수 있습니다. 특히 여러 앱과 패키지를 동시에 개발할 때 그 진가를 발휘합니다.
    `,
    date: "2024-01-10",
    slug: "turborepo-monorepo-setup",
    tags: ["Turborepo", "Monorepo", "DevOps"],
    readTime: "12분",
  },
  {
    id: 3,
    title: "TypeScript 5.0 새로운 기능들",
    content: `
# TypeScript 5.0 새로운 기능들

TypeScript 5.0이 출시되면서 많은 새로운 기능과 개선사항이 추가되었습니다. 이번 포스트에서는 주요 변경사항들을 살펴보겠습니다.

## 주요 새 기능

### 1. Decorators
ECMAScript 표준에 맞춘 새로운 데코레이터 문법을 지원합니다.

\`\`\`typescript
function logged(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(\`Calling \${propertyKey} with\`, args);
    return originalMethod.apply(this, args);
  };
}

class Calculator {
  @logged
  add(a: number, b: number) {
    return a + b;
  }
}
\`\`\`

### 2. const Type Parameters
제네릭 타입 매개변수에 \`const\` 수정자를 사용할 수 있습니다.

\`\`\`typescript
function identity<const T>(arg: T): T {
  return arg;
}

const result = identity(['a', 'b', 'c']); // readonly ['a', 'b', 'c']
\`\`\`

### 3. 성능 개선
컴파일 속도와 메모리 사용량이 크게 개선되었습니다.

## 마이그레이션 가이드

기존 프로젝트를 TypeScript 5.0으로 업그레이드할 때 주의사항:

1. Node.js 14.17 이상 필요
2. 일부 breaking changes 확인 필요
3. 새로운 ESLint 규칙 적용

## 마무리

TypeScript 5.0은 개발자 경험을 크게 향상시키는 업데이트입니다. 새로운 기능들을 활용하여 더 안전하고 효율적인 코드를 작성해보세요.
    `,
    date: "2024-01-05",
    slug: "typescript-5-new-features",
    tags: ["TypeScript", "JavaScript"],
    readTime: "10분",
  },
  {
    id: 4,
    title: "React Server Components 완전 정복",
    content: `
# React Server Components 완전 정복

React Server Components(RSC)는 React 18에서 도입된 새로운 패러다임으로, 서버에서 컴포넌트를 렌더링하여 성능을 크게 향상시킵니다.

## Server Components vs Client Components

### Server Components
- 서버에서 실행
- 데이터베이스 직접 접근 가능
- 번들 크기에 포함되지 않음
- 상태나 이벤트 핸들러 사용 불가

### Client Components
- 브라우저에서 실행
- 상태와 이벤트 핸들러 사용 가능
- 번들 크기에 포함됨
- \`"use client"\` 지시어 필요

## 실제 사용 예제

\`\`\`tsx
// Server Component
async function BlogPost({ id }: { id: string }) {
  const post = await fetchPost(id); // 서버에서 직접 데이터 페치
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <LikeButton postId={id} /> {/* Client Component */}
    </article>
  );
}

// Client Component
"use client";
function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'}
    </button>
  );
}
\`\`\`

## 성능 최적화 전략

1. **적절한 컴포넌트 분리**: 상호작용이 필요한 부분만 Client Component로 분리
2. **데이터 페칭 최적화**: Server Component에서 병렬로 데이터 페치
3. **Streaming**: Suspense를 활용한 점진적 렌더링

## 마무리

React Server Components는 웹 애플리케이션의 성능을 혁신적으로 개선할 수 있는 기술입니다. Next.js 13+에서 기본적으로 지원하므로, 새 프로젝트에서는 적극 활용해보시기 바랍니다.
    `,
    date: "2023-12-28",
    slug: "react-server-components-guide",
    tags: ["React", "Next.js", "Performance"],
    readTime: "15분",
  },
  {
    id: 5,
    title: "Tailwind CSS 디자인 시스템 구축하기",
    content: `
# Tailwind CSS 디자인 시스템 구축하기

Tailwind CSS는 유틸리티 퍼스트 CSS 프레임워크로, 일관성 있는 디자인 시스템을 구축하는 데 매우 유용합니다.

## 디자인 시스템의 중요성

### 1. 일관성
모든 컴포넌트가 동일한 디자인 원칙을 따릅니다.

### 2. 효율성
재사용 가능한 컴포넌트로 개발 속도가 향상됩니다.

### 3. 유지보수성
중앙화된 스타일 관리로 유지보수가 쉬워집니다.

## Tailwind 설정 커스터마이징

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    }
  }
}
\`\`\`

## 컴포넌트 라이브러리 구축

\`\`\`tsx
// Button 컴포넌트
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children,
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button 
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]}\`}
      {...props}
    >
      {children}
    </button>
  );
}
\`\`\`

## 마무리

Tailwind CSS를 활용한 디자인 시스템은 개발 효율성과 디자인 일관성을 동시에 확보할 수 있는 훌륭한 방법입니다. 프로젝트 초기부터 체계적으로 구축해나가시기 바랍니다.
    `,
    date: "2023-12-20",
    slug: "tailwind-design-system",
    tags: ["Tailwind CSS", "Design System", "UI/UX"],
    readTime: "11분",
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back to blog */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/blog">← 블로그로 돌아가기</Link>
          </Button>
        </div>

        {/* Article header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-muted-foreground">
            <time>
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{post.readTime} 읽기</span>
          </div>
        </header>

        {/* Article content */}
        <article className="prose prose-lg max-w-none">
          <div 
            className="whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />
        </article>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/blog">← 더 많은 포스트 보기</Link>
            </Button>
            <Button asChild>
              <Link href="/about">작성자 소개 →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 