import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import crypto from 'crypto';

// Notion 웹훅 이벤트 타입 정의
interface NotionWebhookEvent {
  object: 'event';
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: 'user';
    id: string;
  };
  last_edited_by: {
    object: 'user';
    id: string;
  };
  parent: {
    type: 'database_id';
    database_id: string;
  };
  properties: Record<string, any>;
  url: string;
  public_url?: string;
}

interface NotionWebhookPayload {
  object: 'list';
  results: NotionWebhookEvent[];
  next_cursor?: string;
  has_more: boolean;
  type: 'page_or_database';
  page_or_database: {};
  request_id: string;
}

// 웹훅 서명 검증 함수
function verifyNotionSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }

  try {
    // Notion 웹훅 서명 형식: "v0=<hash>"
    const [version, hash] = signature.split('=');
    
    if (version !== 'v0') {
      console.error('Unsupported webhook signature version:', version);
      return false;
    }

    // HMAC-SHA256으로 서명 생성
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    // 타이밍 공격 방지를 위한 상수 시간 비교
    return crypto.timingSafeEqual(
      Buffer.from(hash || '', 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

// 캐시 무효화 함수
async function invalidateCache(event: NotionWebhookEvent) {
  const { parent, properties } = event;
  
  // 블로그 데이터베이스인지 확인
  if (parent.database_id !== process.env.NOTION_BLOG_DATABASE_ID) {
    console.log('Event not from blog database, skipping cache invalidation');
    return;
  }

  // Published 상태 확인
  const isPublished = properties?.Published?.checkbox;
  const slug = properties?.Slug?.rich_text?.[0]?.plain_text;

  console.log('Cache invalidation triggered:', {
    eventId: event.id,
    isPublished,
    slug,
    lastEdited: event.last_edited_time
  });

  // 무효화할 태그들
  const tagsToRevalidate = [
    'notion-blog',
    'blog-posts',
    'blog-tags',
    'notion-content',
    'notion-images'
  ];

  // 무효화할 경로들
  const pathsToRevalidate = [
    '/blog',
    '/api/blog'
  ];

  // 특정 포스트 경로도 무효화 (slug가 있는 경우)
  if (slug) {
    pathsToRevalidate.push(`/blog/${slug}`);
  }

  try {
    // 태그 기반 캐시 무효화
    for (const tag of tagsToRevalidate) {
      revalidateTag(tag);
      console.log(`Revalidated tag: ${tag}`);
    }

    // 경로 기반 캐시 무효화
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
      console.log(`Revalidated path: ${path}`);
    }

    console.log('Cache invalidation completed successfully');
  } catch (error) {
    console.error('Error during cache invalidation:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 읽기
    const body = await request.text();
    
    // 웹훅 서명 검증
    const signature = request.headers.get('notion-webhook-signature');
    const webhookSecret = process.env.NOTION_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('NOTION_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      );
    }

    // 서명 검증
    if (!verifyNotionSignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // JSON 파싱
    let payload: NotionWebhookPayload;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      console.error('Invalid JSON payload:', error);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    console.log('Notion webhook received:', {
      requestId: payload.request_id,
      eventCount: payload.results.length,
      hasMore: payload.has_more
    });

    // 각 이벤트에 대해 캐시 무효화 실행
    const invalidationPromises = payload.results.map(async (event) => {
      try {
        await invalidateCache(event);
        return { eventId: event.id, status: 'success' };
      } catch (error) {
        console.error(`Failed to invalidate cache for event ${event.id}:`, error);
        return { eventId: event.id, status: 'error', error: error instanceof Error ? error.message : String(error) };
      }
    });

    const results = await Promise.allSettled(invalidationPromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Cache invalidation summary: ${successful} successful, ${failed} failed`);

    return NextResponse.json({
      message: 'Webhook processed successfully',
      requestId: payload.request_id,
      eventsProcessed: payload.results.length,
      successful,
      failed,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET 요청으로 웹훅 상태 확인
export async function GET() {
  return NextResponse.json({
    message: 'Notion webhook endpoint is active',
    timestamp: new Date().toISOString(),
    environment: {
      hasWebhookSecret: !!process.env.NOTION_WEBHOOK_SECRET,
      hasBlogDatabaseId: !!process.env.NOTION_BLOG_DATABASE_ID,
    }
  });
} 