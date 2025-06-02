# 지원의 개발 블로그

개발하면서 배운 것들과 경험을 기록하고 공유하는 개인 블로그입니다.

## 🚀 기술 스택

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content**: [Notion API](https://developers.notion.com/)
- **Monorepo**: [Turborepo](https://turborepo.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📁 프로젝트 구조

이 Turborepo 프로젝트는 다음과 같은 앱과 패키지들로 구성되어 있습니다:

### Apps

- `web`: 메인 블로그 웹 애플리케이션 (Next.js)

### Packages

- `@jiwonme/jds`: 공유 React 컴포넌트 라이브러리 (Jiwon Design System)
- `@jiwonme/editor`: 마크다운 에디터 컴포넌트
- `@jiwonme/eslint-config`: ESLint 설정
- `@jiwonme/typescript-config`: TypeScript 설정

모든 패키지/앱은 100% [TypeScript](https://www.typescriptlang.org/)로 작성되었습니다.

## 🛠️ 개발 도구

- [TypeScript](https://www.typescriptlang.org/) - 정적 타입 검사
- [ESLint](https://eslint.org/) - 코드 린팅
- [Prettier](https://prettier.io) - 코드 포맷팅
- [Turbo](https://turborepo.com/) - 빌드 시스템 및 캐싱

## 🏃‍♂️ 시작하기

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발

모든 앱과 패키지를 개발 모드로 실행:

```bash
pnpm dev
```

### 빌드

모든 앱과 패키지를 빌드:

```bash
pnpm build
```

### 기타 명령어

```bash
# 린팅
pnpm lint

# 타입 체크
pnpm check-types

# 코드 포맷팅
pnpm format
```

## 🌟 주요 기능

- **Notion 연동**: Notion을 CMS로 사용하여 블로그 포스트 관리
- **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- **다크 모드**: 시스템 설정에 따른 자동 다크/라이트 모드
- **검색 기능**: 제목, 내용, 태그 기반 실시간 검색
- **태그 필터링**: 카테고리별 포스트 필터링
- **SEO 최적화**: 메타데이터 및 Open Graph 최적화
- **성능 최적화**: ISR(Incremental Static Regeneration) 적용

## 📝 블로그 포스트 작성

1. Notion에서 새 페이지 생성
2. 블로그 데이터베이스에 추가
3. 필요한 속성들(제목, 태그, 발행일 등) 설정
4. 자동으로 블로그에 반영 (1시간마다 재생성)

## 🚀 배포

이 프로젝트는 [Vercel](https://vercel.com)에 배포되어 있습니다.

## 📚 참고 자료

- [Next.js 문서](https://nextjs.org/docs)
- [Turborepo 문서](https://turborepo.com/docs)
- [Notion API 문서](https://developers.notion.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
