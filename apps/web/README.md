# 지원의 개발 블로그

Next.js와 Notion API를 활용한 개인 블로그 웹사이트입니다. Notion을 CMS로 사용하여 블로그 포스트를 관리하고, 최적화된 성능과 사용자 경험을 제공합니다.

## ✨ 주요 기능

### 📝 블로그 기능
- **Notion CMS 연동**: Notion 데이터베이스를 통한 블로그 포스트 관리
- **자동 썸네일 생성**: 커버 이미지, 첫 번째 이미지, 자동 생성 썸네일 우선순위 적용
- **수식 지원**: LaTeX 형식의 인라인 수식 및 블록 수식 렌더링
- **자동 요약 생성**: Excerpt가 없을 때 본문에서 자동으로 요약 추출
- **태그 시스템**: 다중 태그 지원 및 태그별 필터링
- **읽기 시간 계산**: 자동 읽기 시간 추정

### 🚀 성능 최적화
- **Next.js 캐싱**: `unstable_cache`를 활용한 효율적인 데이터 캐싱
- **이미지 최적화**: Next.js Image 컴포넌트와 이미지 프록시를 통한 최적화
- **ISR (Incremental Static Regeneration)**: 정적 생성과 동적 업데이트의 조합
- **캐시 무효화 API**: 수동 캐시 갱신을 위한 API 엔드포인트

### 🎨 UI/UX
- **반응형 디자인**: 모바일부터 데스크톱까지 최적화된 레이아웃
- **다크/라이트 모드**: 시스템 설정에 따른 자동 테마 전환
- **컴포넌트 시스템**: 재사용 가능한 UI 컴포넌트 라이브러리 활용

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, @jiwonme/jds (커스텀 디자인 시스템)
- **CMS**: Notion API
- **Deployment**: Vercel
- **Image Optimization**: Next.js Image, 커스텀 이미지 프록시

## 📋 사전 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn
- Notion 계정 및 Integration 토큰

## 🚀 설치 및 설정

### 1. 저장소 클론
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. 의존성 설치
```bash
npm install
# 또는
yarn install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Notion 설정
NOTION_TOKEN=your_notion_integration_token
NOTION_BLOG_DATABASE_ID=your_notion_database_id

# 캐시 무효화 (선택사항)
REVALIDATION_SECRET=your_secret_key_for_cache_revalidation

# 사이트 URL (프로덕션)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 4. Notion 데이터베이스 설정

Notion에서 블로그 데이터베이스를 생성하고 다음 속성들을 추가하세요:

| 속성명 | 타입 | 설명 |
|--------|------|------|
| Title | Title | 포스트 제목 |
| Slug | Rich Text | URL 슬러그 |
| Excerpt | Rich Text | 포스트 요약 (선택사항) |
| Date | Date | 발행일 |
| Tags | Multi-select | 태그 목록 |
| Published | Checkbox | 발행 여부 |

### 5. Notion Integration 설정

1. [Notion Developers](https://developers.notion.com/)에서 새 Integration 생성
2. Integration 토큰을 환경 변수에 추가
3. 블로그 데이터베이스를 Integration과 공유

### 6. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 `http://localhost:3000`을 열어 확인하세요.

## 📁 프로젝트 구조

```
apps/web/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   ├── image-proxy/   # 이미지 프록시
│   │   └── revalidate/    # 캐시 무효화
│   ├── blog/              # 블로그 페이지
│   └── page.tsx           # 홈페이지
├── components/            # 재사용 가능한 컴포넌트
├── lib/                   # 유틸리티 및 라이브러리
│   ├── blog.ts           # 블로그 관련 함수
│   ├── notion.ts         # Notion API 헬퍼
│   └── fallback-data.ts  # 폴백 데이터
├── types/                 # TypeScript 타입 정의
└── next.config.js         # Next.js 설정
```

## 🔧 주요 기능 사용법

### 캐시 무효화
블로그 포스트를 업데이트한 후 캐시를 수동으로 갱신하려면:

```bash
# 전체 캐시 갱신
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET"

# 특정 태그만 갱신
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&tag=blog-posts"
```

### 수식 작성
Notion에서 수식을 작성하면 자동으로 LaTeX 형식으로 변환됩니다:

- **인라인 수식**: `$E=mc^2$`
- **블록 수식**: `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`

### 이미지 최적화
- Notion의 이미지는 자동으로 프록시를 통해 최적화됩니다
- Next.js Image 컴포넌트를 통해 WebP/AVIF 형식으로 자동 변환
- 반응형 이미지 크기 자동 조정

## 🚀 배포

### Vercel 배포 (권장)
1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 완료

### 기타 플랫폼
Next.js를 지원하는 모든 플랫폼에서 배포 가능합니다.

## 📊 성능 최적화

### 캐싱 전략
- **블로그 포스트 목록**: 30분 캐시
- **개별 포스트**: 1시간 캐시
- **이미지**: 1년 캐시
- **페이지 콘텐츠**: 1시간 캐시

### 이미지 최적화
- 자동 WebP/AVIF 변환
- 반응형 이미지 크기
- Lazy loading
- CDN 캐싱

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**Built with ❤️ using Next.js and Notion**
