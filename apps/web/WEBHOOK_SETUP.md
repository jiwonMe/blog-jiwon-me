# Notion 웹훅 설정 가이드

이 가이드는 Notion에서 블로그 데이터가 변경될 때 자동으로 캐시를 무효화하는 웹훅을 설정하는 방법을 설명합니다.

## 🔧 환경 변수 설정

먼저 `.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# 기존 설정
NOTION_TOKEN=your_notion_integration_token
NOTION_BLOG_DATABASE_ID=your_blog_database_id
REVALIDATE_SECRET=your_super_secret_revalidation_key

# 웹훅 설정 (새로 추가)
NOTION_WEBHOOK_SECRET=your_webhook_secret_key
```

## 📋 사전 요구사항

1. **Notion Integration 설정 완료**
   - Notion Integration이 생성되어 있어야 합니다
   - 블로그 데이터베이스에 대한 읽기 권한이 있어야 합니다

2. **배포된 웹사이트**
   - 웹훅 엔드포인트가 공개적으로 접근 가능해야 합니다
   - HTTPS 프로토콜을 사용해야 합니다

## 🚀 웹훅 설정 단계

### 1단계: 웹훅 시크릿 생성

안전한 랜덤 문자열을 생성하여 `NOTION_WEBHOOK_SECRET`으로 설정하세요:

```bash
# 랜덤 시크릿 생성 (macOS/Linux)
openssl rand -hex 32

# 또는 Node.js로 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2단계: 웹훅 엔드포인트 확인

배포 후 웹훅 엔드포인트가 정상 작동하는지 확인하세요:

```bash
# 웹훅 상태 확인
curl https://yourdomain.com/api/webhook/notion

# 예상 응답:
# {
#   "message": "Notion webhook endpoint is active",
#   "timestamp": "2024-01-01T00:00:00.000Z",
#   "environment": {
#     "hasWebhookSecret": true,
#     "hasBlogDatabaseId": true
#   }
# }
```

### 3단계: Notion 웹훅 생성

#### 방법 1: API를 통한 자동 생성 (권장)

```bash
# 웹훅 생성
curl -X POST "https://yourdomain.com/api/webhook/manage?secret=YOUR_REVALIDATE_SECRET&baseUrl=https://yourdomain.com"

# 성공 응답 예시:
# {
#   "message": "Webhook created successfully",
#   "webhook": {
#     "id": "webhook_id_here",
#     "url": "https://yourdomain.com/api/webhook/notion",
#     "event_types": ["page.property_values.updated", "page.created", "page.deleted"]
#   }
# }
```

#### 방법 2: Notion API 직접 호출

```bash
curl -X POST 'https://api.notion.com/v1/webhooks' \
  -H 'Authorization: Bearer YOUR_NOTION_TOKEN' \
  -H 'Content-Type: application/json' \
  -H 'Notion-Version: 2022-06-28' \
  -d '{
    "parent": {
      "type": "database_id",
      "database_id": "YOUR_BLOG_DATABASE_ID"
    },
    "url": "https://yourdomain.com/api/webhook/notion",
    "event_types": [
      "page.property_values.updated",
      "page.created", 
      "page.deleted"
    ],
    "filter": {
      "property": "Published",
      "checkbox": {
        "equals": true
      }
    }
  }'
```

### 4단계: 웹훅 테스트

Notion에서 블로그 포스트를 수정하고 로그를 확인하세요:

```bash
# Vercel 로그 확인 (Vercel CLI 필요)
vercel logs

# 또는 Vercel 대시보드에서 Functions 탭 확인
```

예상 로그:
```
Notion webhook received: { requestId: "...", eventCount: 1, hasMore: false }
Cache invalidation triggered: { eventId: "...", isPublished: true, slug: "my-post" }
Revalidated tag: notion-blog
Revalidated path: /blog
Cache invalidation completed successfully
```

## 🔍 웹훅 관리

### 웹훅 목록 조회

```bash
curl "https://yourdomain.com/api/webhook/manage?secret=YOUR_REVALIDATE_SECRET"
```

### 웹훅 상태 확인

```bash
curl "https://yourdomain.com/api/webhook/manage?secret=YOUR_REVALIDATE_SECRET&action=status&webhookUrl=https://yourdomain.com/api/webhook/notion"
```

### 웹훅 삭제

```bash
curl -X DELETE "https://yourdomain.com/api/webhook/manage?secret=YOUR_REVALIDATE_SECRET&webhookId=WEBHOOK_ID"
```

## 🐛 문제 해결

### 1. 웹훅이 호출되지 않는 경우

**확인사항:**
- Notion Integration이 데이터베이스에 연결되어 있는지 확인
- 웹훅 URL이 HTTPS인지 확인
- 웹훅 엔드포인트가 200 응답을 반환하는지 확인

**해결방법:**
```bash
# 웹훅 엔드포인트 테스트
curl -X POST https://yourdomain.com/api/webhook/notion \
  -H "Content-Type: application/json" \
  -H "notion-webhook-signature: v0=test" \
  -d '{"object":"list","results":[],"type":"page_or_database","page_or_database":{},"request_id":"test"}'
```

### 2. 서명 검증 실패

**확인사항:**
- `NOTION_WEBHOOK_SECRET`이 올바르게 설정되어 있는지 확인
- 환경 변수가 배포 환경에 적용되어 있는지 확인

**해결방법:**
```bash
# 환경 변수 확인
curl https://yourdomain.com/api/webhook/notion
```

### 3. 캐시가 무효화되지 않는 경우

**확인사항:**
- 이벤트가 블로그 데이터베이스에서 발생했는지 확인
- Published 속성이 true인지 확인

**수동 캐시 무효화:**
```bash
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_REVALIDATE_SECRET"
```

## 📊 모니터링

### 웹훅 이벤트 로깅

웹훅 이벤트는 자동으로 로깅됩니다. Vercel 대시보드에서 확인할 수 있습니다:

1. Vercel 대시보드 → 프로젝트 선택
2. Functions 탭 → `/api/webhook/notion` 함수 선택
3. 로그 확인

### 성능 모니터링

웹훅을 통한 자동 캐시 무효화로 다음과 같은 개선을 기대할 수 있습니다:

- **실시간 업데이트**: 포스트 변경 시 즉시 반영
- **캐시 효율성**: 불필요한 캐시 무효화 방지
- **사용자 경험**: 항상 최신 콘텐츠 제공

## 🔒 보안 고려사항

1. **웹훅 시크릿 보안**
   - 시크릿을 안전하게 보관하세요
   - 정기적으로 시크릿을 교체하세요

2. **서명 검증**
   - 모든 웹훅 요청의 서명을 검증합니다
   - 잘못된 서명은 자동으로 거부됩니다

3. **Rate Limiting**
   - Notion 웹훅은 자체적으로 rate limiting을 적용합니다
   - 과도한 요청 시 일시적으로 차단될 수 있습니다

## 📝 추가 정보

- [Notion Webhooks API 문서](https://developers.notion.com/reference/webhooks)
- [Next.js 캐시 무효화 문서](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [Vercel 함수 로깅](https://vercel.com/docs/functions/logs)

---

웹훅 설정이 완료되면 Notion에서 블로그 포스트를 수정할 때마다 자동으로 캐시가 갱신되어 실시간으로 변경사항이 반영됩니다! 🎉 