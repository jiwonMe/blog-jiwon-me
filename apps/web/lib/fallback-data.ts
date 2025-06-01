import { BlogPost } from '../types/blog';

// Fallback blog posts when Notion is not configured
export const fallbackBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Next.js 14와 App Router로 블로그 만들기",
    excerpt: "최신 Next.js 14의 App Router를 사용하여 개발 블로그를 구축하는 과정을 소개합니다. 파일 기반 라우팅부터 서버 컴포넌트까지 자세히 알아봅니다.",
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

## 마무리

Next.js 14의 App Router를 사용하면 더욱 효율적이고 성능이 좋은 블로그를 만들 수 있습니다. Notion API를 연동하면 더욱 강력한 CMS 기능을 활용할 수 있습니다.`,
    date: "2024-01-15",
    slug: "nextjs-14-blog-setup",
    tags: ["Next.js", "React", "TypeScript"],
    readTime: "8분",
    coverImage: "https://via.placeholder.com/1200x630/000000/FFFFFF?text=Next.js%2014%EC%99%80%20App%20Router%EB%A1%9C%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%A7%8C%EB%93%A4%EA%B8%B0",
    published: true,
  },
  {
    id: "2",
    title: "Notion API를 활용한 블로그 CMS 구축하기",
    excerpt: "Notion을 CMS로 활용하여 블로그를 구축하는 방법을 알아봅니다. API 연동부터 콘텐츠 렌더링까지 전체 과정을 다룹니다.",
    content: `# Notion API를 활용한 블로그 CMS 구축하기

Notion은 강력한 노트 작성 도구일 뿐만 아니라 훌륭한 CMS(Content Management System)로도 활용할 수 있습니다. 이번 포스트에서는 Notion API를 사용하여 블로그 CMS를 구축하는 방법을 알아보겠습니다.

## Notion API의 장점

### 1. 직관적인 편집 환경
Notion의 블록 기반 에디터를 통해 쉽게 콘텐츠를 작성할 수 있습니다.

### 2. 구조화된 데이터
데이터베이스 기능을 통해 메타데이터를 체계적으로 관리할 수 있습니다.

### 3. 협업 기능
팀원들과 함께 콘텐츠를 작성하고 검토할 수 있습니다.

## 구현 과정

### 1. Notion Integration 생성
먼저 Notion에서 Integration을 생성하고 API 토큰을 발급받습니다.

### 2. 데이터베이스 설계
블로그 포스트를 위한 데이터베이스를 생성하고 필요한 속성들을 정의합니다.

### 3. API 연동
\`@notionhq/client\` 패키지를 사용하여 Notion API와 연동합니다.

\`\`\`typescript
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
\`\`\`

## 마무리

Notion API를 활용하면 개발자와 콘텐츠 작성자 모두에게 편리한 블로그 시스템을 구축할 수 있습니다. 설정 방법은 NOTION_SETUP.md 파일을 참고하세요.`,
    date: "2024-01-10",
    slug: "notion-api-blog-cms",
    tags: ["Notion", "API", "CMS"],
    readTime: "12분",
    coverImage: "https://via.placeholder.com/1200x630/4CAF50/FFFFFF?text=Notion%20API%EB%A5%BC%20%ED%99%9C%EC%9A%A9%ED%95%9C%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20CMS%20%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0",
    published: true,
  },
  {
    id: "3",
    title: "TypeScript와 React로 타입 안전한 개발하기",
    excerpt: "TypeScript를 활용하여 React 애플리케이션을 더욱 안전하고 효율적으로 개발하는 방법을 알아봅니다.",
    content: `# TypeScript와 React로 타입 안전한 개발하기

TypeScript는 JavaScript에 정적 타입을 추가한 언어로, React 개발에서 많은 이점을 제공합니다. 이번 포스트에서는 TypeScript와 React를 함께 사용하는 방법을 알아보겠습니다.

## TypeScript의 장점

### 1. 컴파일 타임 에러 검출
런타임 에러를 미리 방지할 수 있습니다.

### 2. 향상된 IDE 지원
자동완성, 리팩토링 등의 기능을 더욱 효과적으로 사용할 수 있습니다.

### 3. 코드 가독성 향상
타입 정보를 통해 코드의 의도를 명확하게 표현할 수 있습니다.

## React 컴포넌트 타이핑

\`\`\`typescript
interface Props {
  title: string;
  count: number;
  onIncrement: () => void;
}

function Counter({ title, count, onIncrement }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
}
\`\`\`

## 마무리

TypeScript를 사용하면 더욱 안전하고 유지보수하기 쉬운 React 애플리케이션을 개발할 수 있습니다.`,
    date: "2024-01-05",
    slug: "typescript-react-development",
    tags: ["TypeScript", "React", "Development"],
    readTime: "10분",
    // coverImage: undefined, // 썸네일 없는 경우 테스트용
    published: true,
  },
];

export function getFallbackBlogPosts(): BlogPost[] {
  return fallbackBlogPosts;
}

export function getFallbackBlogPost(slug: string): BlogPost | null {
  return fallbackBlogPosts.find(post => post.slug === slug) || null;
}

export function getFallbackTags(): string[] {
  const allTags = fallbackBlogPosts.flatMap(post => post.tags);
  return Array.from(new Set(allTags));
} 