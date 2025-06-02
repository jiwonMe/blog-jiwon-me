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
- **실시간 검색**: 2글자 이상 입력 시 실시간 검색 결과 제공
- **검색어 하이라이트**: 검색 결과에서 검색어 강조 표시

### 🚀 성능 최적화
- **ISR (Incremental Static Regeneration)**: 정적 생성과 동적 업데이트의 조합
- **Next.js 캐싱**: `unstable_cache`를 활용한 효율적인 데이터 캐싱
- **CDN 캐싱**: 강력한 HTTP 캐싱 헤더로 CDN 활용 극대화
- **이미지 최적화**: Next.js Image 컴포넌트와 이미지 프록시를 통한 최적화
- **캐시 무효화 API**: 수동 캐시 갱신을 위한 API 엔드포인트
- **Notion 웹훅 연동**: 실시간 자동 캐시 무효화
- **서버/클라이언트 컴포넌트 분리**: 최적의 렌더링 전략 적용

### 🎨 UI/UX
- **반응형 디자인**: 모바일부터 데스크톱까지 최적화된 레이아웃
- **다크/라이트 모드**: 시스템 설정에 따른 자동 테마 전환
- **컴포넌트 시스템**: 재사용 가능한 UI 컴포넌트 라이브러리 활용
- **스켈레톤 로딩**: 부드러운 로딩 경험 제공
- **키보드 단축키**: 검색 기능 키보드 단축키 지원 (Cmd/Ctrl + K)

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, @jiwonme/jds (커스텀 디자인 시스템)
- **CMS**: Notion API
- **Deployment**: Vercel
- **Image Optimization**: Next.js Image, 커스텀 이미지 프록시
- **Caching**: Next.js ISR, HTTP 캐싱, CDN 캐싱

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
# 필수: Notion 설정
NOTION_TOKEN=your_notion_integration_token
NOTION_BLOG_DATABASE_ID=your_blog_database_id

# 필수: 캐시 무효화 시크릿 (랜덤한 문자열)
REVALIDATE_SECRET=your_super_secret_revalidation_key

# 웹훅 설정 (실시간 캐시 무효화용)
NOTION_WEBHOOK_SECRET=your_webhook_secret_key

# 선택사항: 성능 모니터링
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

### 4. Notion 데이터베이스 설정
Notion에서 블로그 데이터베이스를 생성하고 다음 속성들을 추가하세요:

- **Title** (제목): Title 타입
- **Slug** (슬러그): Rich text 타입
- **Excerpt** (요약): Rich text 타입 (선택사항)
- **Date** (날짜): Date 타입
- **Tags** (태그): Multi-select 타입
- **Published** (게시됨): Checkbox 타입
- **Cover** (커버 이미지): Files & media 타입 (선택사항)

### 5. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

## 🔧 주요 기능 사용법

### 캐시 무효화

#### 자동 캐시 무효화 (권장)
Notion 웹훅을 설정하면 블로그 포스트 변경 시 자동으로 캐시가 갱신됩니다:

```bash
# 웹훅 생성
curl -X POST "https://yourdomain.com/api/webhook/manage?secret=YOUR_SECRET&baseUrl=https://yourdomain.com"

# 웹훅 상태 확인
curl "https://yourdomain.com/api/webhook/manage?secret=YOUR_SECRET"
```

자세한 설정 방법은 [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md)를 참조하세요.

#### 수동 캐시 무효화
필요시 수동으로 캐시를 갱신할 수 있습니다:

```bash
# 전체 캐시 갱신
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET"

# 특정 태그만 갱신
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&tag=blog-posts"

# 특정 경로만 갱신
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/blog"
```

### 수식 작성
Notion에서 수식을 작성하면 자동으로 LaTeX 형식으로 변환됩니다:

- **인라인 수식**: `$E=mc^2$`
- **블록 수식**: `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`

### 이미지 최적화
- Notion의 이미지는 자동으로 프록시를 통해 최적화됩니다
- Next.js Image 컴포넌트를 통해 WebP/AVIF 형식으로 자동 변환
- 반응형 이미지 크기 자동 조정

### 검색 기능
- 2글자 이상 입력 시 실시간 검색 활성화
- 제목, 내용, 태그에서 검색
- 키보드 단축키: `Cmd/Ctrl + K`
- 검색어 하이라이트 표시

## 🚀 배포

### Vercel 배포 (권장)
1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 완료

### 기타 플랫폼
Next.js를 지원하는 모든 플랫폼에서 배포 가능합니다.

## 📊 성능 최적화

### 캐싱 전략
- **블로그 포스트 목록**: 1시간 캐시 (ISR)
- **개별 포스트**: 2시간 캐시 (ISR)
- **이미지**: 1년 캐시 (CDN)
- **페이지 콘텐츠**: 2시간 캐시 (ISR)
- **API 응답**: 30분 CDN 캐시 + 1시간 stale-while-revalidate

### 이미지 최적화
- 자동 WebP/AVIF 변환
- 반응형 이미지 크기
- Lazy loading
- CDN 캐싱 (1년)
- 이미지 프록시를 통한 CORS 해결

### 성능 지표 (예상)
- **First Contentful Paint**: < 1.5초
- **Largest Contentful Paint**: < 2.5초
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3초

### 비용 최적화
월 10만 방문자 기준 예상 비용 절감:
- **기존**: $100-280/월
- **최적화 후**: $25-50/월
- **절감률**: 70-80%

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
