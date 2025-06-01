import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@jiwonme/jds";
import { MarkdownRenderer } from "../../../components/markdown-renderer";

// 임시 블로그 포스트 데이터 (실제로는 CMS나 마크다운 파일에서 가져올 것)
const blogPosts = [
  {
    id: 1,
    title: "Next.js 14와 App Router로 블로그 만들기",
    content: `# Next.js 14와 App Router로 블로그 만들기

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

\`\`\`typescript
// app 디렉토리 구조
app/
├── layout.tsx          // 루트 레이아웃
├── page.tsx            // 홈페이지
├── blog/
│   ├── page.tsx        // 블로그 목록
│   └── [slug]/
│       └── page.tsx    // 개별 포스트
└── about/
    └── page.tsx        // 소개 페이지
\`\`\`

## 성능 최적화

App Router의 성능 향상은 다음 공식으로 표현할 수 있습니다:

$$Performance = \\frac{Server\\,Components + Static\\,Generation}{Client\\,Side\\,Rendering}$$

여기서:
- $Server\\,Components$: 서버에서 렌더링되는 컴포넌트
- $Static\\,Generation$: 정적 생성된 페이지
- $Client\\,Side\\,Rendering$: 클라이언트 렌더링

## 코드 예제

다음은 기본적인 블로그 페이지 컴포넌트입니다:

\`\`\`tsx
// app/blog/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
\`\`\`

## 마무리

Next.js 14의 App Router를 사용하면 더욱 효율적이고 성능이 좋은 블로그를 만들 수 있습니다. 다음 포스트에서는 MDX를 활용한 마크다운 블로그 구현에 대해 다뤄보겠습니다.`,
    date: "2024-01-15",
    slug: "nextjs-14-blog-setup",
    tags: ["Next.js", "React", "TypeScript"],
    readTime: "8분",
  },
  {
    id: 2,
    title: "Turborepo로 모노레포 구성하기",
    content: `# Turborepo로 모노레포 구성하기

모노레포(Monorepo)는 여러 프로젝트를 하나의 저장소에서 관리하는 방식입니다. Turborepo는 Vercel에서 개발한 고성능 빌드 시스템으로, JavaScript/TypeScript 모노레포를 효율적으로 관리할 수 있게 해줍니다.

## Turborepo의 장점

### 1. 빠른 빌드
캐싱과 병렬 처리를 통해 빌드 시간을 대폭 단축합니다.

### 2. 의존성 관리
패키지 간 의존성을 자동으로 분석하고 올바른 순서로 빌드합니다.

### 3. 개발 경험 향상
Hot reload와 같은 개발 도구들이 모노레포 환경에서도 원활하게 작동합니다.

## 프로젝트 구조

\`\`\`bash
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

## 성능 분석

Turborepo의 캐싱 효율성은 다음과 같이 계산할 수 있습니다:

$$Efficiency = 1 - \\frac{Rebuild\\,Time}{Initial\\,Build\\,Time}$$

일반적으로 캐시 히트율이 높을수록 효율성이 증가합니다:

- 첫 번째 빌드: $t_1 = 100s$
- 캐시된 빌드: $t_2 = 10s$
- 효율성: $E = 1 - \\frac{10}{100} = 0.9$ (90% 향상)

## 설정 방법

Turborepo를 설정하는 방법은 매우 간단합니다:

\`\`\`bash
# 새 프로젝트 생성
npx create-turbo@latest

# 기존 프로젝트에 추가
npm install turbo --save-dev
\`\`\`

### turbo.json 설정 예제

\`\`\`json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
\`\`\`

## 마무리

Turborepo를 사용하면 복잡한 모노레포도 쉽게 관리할 수 있습니다. 특히 여러 앱과 패키지를 동시에 개발할 때 그 진가를 발휘합니다.

> **팁**: 캐시 최적화를 위해 \`inputs\`와 \`outputs\`를 정확히 설정하는 것이 중요합니다.`,
    date: "2024-01-10",
    slug: "turborepo-monorepo-setup",
    tags: ["Turborepo", "Monorepo", "DevOps"],
    readTime: "12분",
  },
  {
    id: 3,
    title: "TypeScript 5.0 새로운 기능들",
    content: `# TypeScript 5.0 새로운 기능들

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

// 사용 예제
const calc = new Calculator();
calc.add(2, 3); // 콘솔: "Calling add with [2, 3]"
\`\`\`

### 2. const Type Parameters
제네릭 타입 매개변수에 \`const\` 수정자를 사용할 수 있습니다.

\`\`\`typescript
function identity<const T>(arg: T): T {
  return arg;
}

const result = identity(['a', 'b', 'c']); // readonly ['a', 'b', 'c']
const numbers = identity([1, 2, 3] as const); // readonly [1, 2, 3]
\`\`\`

### 3. 성능 개선
컴파일 속도와 메모리 사용량이 크게 개선되었습니다.

성능 향상 지표:

| 항목 | TypeScript 4.9 | TypeScript 5.0 | 개선율 |
|------|----------------|----------------|--------|
| 컴파일 속도 | 100% | 87% | 13% 향상 |
| 메모리 사용량 | 100% | 75% | 25% 감소 |
| 타입 체크 속도 | 100% | 90% | 10% 향상 |

## 새로운 유틸리티 타입

TypeScript 5.0에서는 새로운 유틸리티 타입들이 추가되었습니다:

\`\`\`typescript
// Awaited<T> - Promise의 결과 타입 추출
type Result = Awaited<Promise<string>>; // string

// Uppercase<T> - 문자열을 대문자로 변환
type HELLO = Uppercase<"hello">; // "HELLO"

// Lowercase<T> - 문자열을 소문자로 변환
type hello = Lowercase<"HELLO">; // "hello"
\`\`\`

## 수학적 타입 연산

TypeScript의 타입 시스템을 활용한 수학적 연산도 가능합니다:

$$TypeSafety = \\frac{Compile\\,Time\\,Checks}{Runtime\\,Errors}$$

여기서 $TypeSafety$가 높을수록 더 안전한 코드를 의미합니다.

## 마이그레이션 가이드

기존 프로젝트를 TypeScript 5.0으로 업그레이드할 때 주의사항:

1. **Node.js 버전**: 14.17 이상 필요
2. **Breaking Changes**: 일부 타입 추론 변경사항 확인
3. **ESLint 규칙**: 새로운 규칙 적용 검토

### 마이그레이션 체크리스트

- [ ] Node.js 버전 확인
- [ ] TypeScript 5.0 설치
- [ ] 컴파일 에러 수정
- [ ] 테스트 실행 및 검증
- [ ] ESLint 규칙 업데이트

## 마무리

TypeScript 5.0은 개발자 경험을 크게 향상시키는 업데이트입니다. 새로운 기능들을 활용하여 더 안전하고 효율적인 코드를 작성해보세요.

> **참고**: 더 자세한 정보는 [TypeScript 5.0 공식 문서](https://www.typescriptlang.org/docs/)를 참조하세요.`,
    date: "2024-01-05",
    slug: "typescript-5-new-features",
    tags: ["TypeScript", "JavaScript"],
    readTime: "10분",
  },
  {
    id: 4,
    title: "React Server Components 완전 정복",
    content: `# React Server Components 완전 정복

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

## 성능 비교

RSC의 성능 향상은 다음 공식으로 나타낼 수 있습니다:

$$Performance\\,Gain = \\frac{Bundle\\,Size\\,Reduction + Server\\,Side\\,Rendering}{Network\\,Latency + Hydration\\,Time}$$

일반적인 성능 지표:

| 메트릭 | 전통적인 CSR | RSC | 개선율 |
|--------|-------------|-----|--------|
| 초기 번들 크기 | 500KB | 200KB | 60% 감소 |
| Time to Interactive | 3.2s | 1.8s | 44% 향상 |
| First Contentful Paint | 2.1s | 1.2s | 43% 향상 |

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
import { useState } from 'react';

function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  
  const handleLike = async () => {
    setLiked(!liked);
    // API 호출
    const response = await fetch(\`/api/posts/\${postId}/like\`, {
      method: 'POST',
      body: JSON.stringify({ liked: !liked })
    });
    const data = await response.json();
    setCount(data.likeCount);
  };
  
  return (
    <button 
      onClick={handleLike}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white"
    >
      {liked ? '❤️' : '🤍'} {count}
    </button>
  );
}
\`\`\`

## 데이터 페칭 패턴

### 병렬 데이터 페칭

\`\`\`tsx
// 좋은 예: 병렬 페칭
async function Dashboard() {
  const [user, posts, analytics] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchAnalytics()
  ]);
  
  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
      <Analytics data={analytics} />
    </div>
  );
}
\`\`\`

### Streaming with Suspense

\`\`\`tsx
import { Suspense } from 'react';

function App() {
  return (
    <div>
      <Header />
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />
      </Suspense>
    </div>
  );
}
\`\`\`

## 성능 최적화 전략

1. **적절한 컴포넌트 분리**: 상호작용이 필요한 부분만 Client Component로 분리
2. **데이터 페칭 최적화**: Server Component에서 병렬로 데이터 페치
3. **Streaming**: Suspense를 활용한 점진적 렌더링
4. **캐싱 전략**: React Cache API 활용

### 최적화 체크리스트

- [ ] 불필요한 Client Component 사용 최소화
- [ ] 데이터 페칭을 Server Component에서 수행
- [ ] Suspense 경계 적절히 설정
- [ ] 캐싱 전략 구현

## 마무리

React Server Components는 웹 애플리케이션의 성능을 혁신적으로 개선할 수 있는 기술입니다. Next.js 13+에서 기본적으로 지원하므로, 새 프로젝트에서는 적극 활용해보시기 바랍니다.

> **주의**: Client Component에서는 서버 전용 API를 사용할 수 없으므로, 컴포넌트 경계를 명확히 구분하는 것이 중요합니다.`,
    date: "2023-12-28",
    slug: "react-server-components-guide",
    tags: ["React", "Next.js", "Performance"],
    readTime: "15분",
  },
  {
    id: 5,
    title: "Tailwind CSS 디자인 시스템 구축하기",
    content: `# Tailwind CSS 디자인 시스템 구축하기

Tailwind CSS는 유틸리티 퍼스트 CSS 프레임워크로, 일관성 있는 디자인 시스템을 구축하는 데 매우 유용합니다.

## 디자인 시스템의 중요성

### 1. 일관성
모든 컴포넌트가 동일한 디자인 원칙을 따릅니다.

### 2. 효율성
재사용 가능한 컴포넌트로 개발 속도가 향상됩니다.

### 3. 유지보수성
중앙화된 스타일 관리로 유지보수가 쉬워집니다.

## 디자인 토큰 체계

디자인 시스템의 일관성은 다음 공식으로 측정할 수 있습니다:

$$Consistency = \\frac{Reused\\,Components}{Total\\,Components} \\times \\frac{Shared\\,Tokens}{Total\\,Tokens}$$

이상적인 디자인 시스템에서는 $Consistency \\geq 0.8$이 되어야 합니다.

## Tailwind 설정 커스터마이징

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ]
}
\`\`\`

## 컴포넌트 라이브러리 구축

### Button 컴포넌트

\`\`\`tsx
// components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
        destructive: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({ 
  variant, 
  size, 
  className,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
\`\`\`

### Input 컴포넌트

\`\`\`tsx
// components/ui/Input.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
\`\`\`

## 디자인 토큰 관리

### 색상 시스템

| 용도 | 토큰 | 값 | 사용 예시 |
|------|------|-----|-----------|
| Primary | \`primary-500\` | \`#3b82f6\` | 주요 버튼, 링크 |
| Success | \`green-500\` | \`#10b981\` | 성공 메시지 |
| Warning | \`yellow-500\` | \`#f59e0b\` | 경고 메시지 |
| Error | \`red-500\` | \`#ef4444\` | 오류 메시지 |

### 타이포그래피 스케일

\`\`\`css
/* 타이포그래피 유틸리티 */
.text-display-xl { font-size: 4.5rem; line-height: 1.1; }
.text-display-lg { font-size: 3.75rem; line-height: 1.1; }
.text-display-md { font-size: 3rem; line-height: 1.2; }
.text-display-sm { font-size: 2.25rem; line-height: 1.3; }

.text-heading-xl { font-size: 1.875rem; line-height: 1.4; }
.text-heading-lg { font-size: 1.5rem; line-height: 1.4; }
.text-heading-md { font-size: 1.25rem; line-height: 1.5; }
.text-heading-sm { font-size: 1.125rem; line-height: 1.5; }

.text-body-lg { font-size: 1.125rem; line-height: 1.6; }
.text-body-md { font-size: 1rem; line-height: 1.6; }
.text-body-sm { font-size: 0.875rem; line-height: 1.6; }
\`\`\`

## 반응형 디자인 전략

\`\`\`tsx
// 반응형 컴포넌트 예제
function ResponsiveCard() {
  return (
    <div className="
      w-full 
      p-4 sm:p-6 lg:p-8
      bg-white 
      rounded-lg sm:rounded-xl
      shadow-sm sm:shadow-md lg:shadow-lg
      border border-gray-200
      max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl
    ">
      <h2 className="text-heading-sm sm:text-heading-md lg:text-heading-lg">
        반응형 카드
      </h2>
      <p className="text-body-sm sm:text-body-md text-gray-600 mt-2">
        화면 크기에 따라 적응하는 카드 컴포넌트입니다.
      </p>
    </div>
  );
}
\`\`\`

## 마무리

Tailwind CSS를 활용한 디자인 시스템은 개발 효율성과 디자인 일관성을 동시에 확보할 수 있는 훌륭한 방법입니다. 프로젝트 초기부터 체계적으로 구축해나가시기 바랍니다.

### 구축 체크리스트

- [ ] 디자인 토큰 정의
- [ ] 컴포넌트 라이브러리 구축
- [ ] 문서화 및 스토리북 설정
- [ ] 팀 내 가이드라인 공유
- [ ] 지속적인 개선 및 업데이트

> **팁**: 디자인 시스템은 한 번에 완성되는 것이 아니라 지속적으로 발전시켜 나가는 것이 중요합니다.`,
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
        <article>
          <MarkdownRenderer content={post.content} />
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