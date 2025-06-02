import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Edge Runtime 사용으로 성능 향상
export const runtime = 'edge';

// 이미지 메타데이터 캐시 (메모리 기반 - 프로덕션에서는 Redis 등 사용 권장)
const imageMetaCache = new Map<string, {
  etag: string;
  contentType: string;
  lastModified: string;
  size: number;
  timestamp: number;
  hitCount: number;
}>();

// 캐시 통계
let cacheStats = {
  hits: 0,
  misses: 0,
  totalRequests: 0,
  totalBytesServed: 0,
};

// 캐시 TTL (1시간)
const CACHE_TTL = 60 * 60 * 1000;

// 캐시 정리 함수
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of imageMetaCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      imageMetaCache.delete(key);
    }
  }
}

// 주기적으로 캐시 정리 (10분마다)
setInterval(cleanupCache, 10 * 60 * 1000);

// 캐시 통계 조회 (개발 환경에서만)
export async function HEAD(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.json({
    cacheStats,
    cacheSize: imageMetaCache.size,
    cacheEntries: Array.from(imageMetaCache.entries()).map(([key, value]) => ({
      key,
      size: value.size,
      hitCount: value.hitCount,
      age: Date.now() - value.timestamp,
    })),
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  // 통계 업데이트
  cacheStats.totalRequests++;

  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    // URL 정규화 (쿼리 파라미터 제거하여 캐시 키 생성)
    const normalizedUrl = new URL(imageUrl);
    let cacheKey: string | null = null;
    
    // Notion URL의 경우 토큰 파라미터들을 제거하여 안정적인 캐시 키 생성
    if (normalizedUrl.hostname.includes('amazonaws.com')) {
      // AWS S3 URL에서 토큰 관련 파라미터들 제거
      const pathOnly = normalizedUrl.pathname;
      cacheKey = crypto.createHash('md5').update(pathOnly).digest('hex');
      
      // 캐시된 메타데이터 확인
      const cachedMeta = imageMetaCache.get(cacheKey);
      if (cachedMeta && Date.now() - cachedMeta.timestamp < CACHE_TTL) {
        // 클라이언트의 If-None-Match 헤더 확인
        const ifNoneMatch = request.headers.get('if-none-match');
        if (ifNoneMatch === cachedMeta.etag) {
          // 캐시 히트 통계 업데이트
          cacheStats.hits++;
          cachedMeta.hitCount++;
          
          return new NextResponse(null, { 
            status: 304,
            headers: {
              'ETag': cachedMeta.etag,
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Last-Modified': cachedMeta.lastModified,
              'X-Cache-Status': 'HIT',
            }
          });
        }
      }
    }

    // Validate that the URL is from Notion or AWS (for security)
    const url = new URL(imageUrl);
    const allowedHosts = [
      'notion.so',
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'images.unsplash.com', // Notion sometimes uses Unsplash
    ];

    const isAllowed = allowedHosts.some(host => 
      url.hostname === host || url.hostname.endsWith(`.${host}`)
    );

    if (!isAllowed) {
      return new NextResponse('Unauthorized URL', { status: 403 });
    }

    // HEAD 요청으로 먼저 메타데이터 확인
    const headResponse = await fetch(imageUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Blog Image Proxy)',
      },
    });

    if (!headResponse.ok) {
      return new NextResponse('Failed to fetch image', { status: headResponse.status });
    }

    const contentType = headResponse.headers.get('content-type') || 'image/jpeg';
    const contentLength = headResponse.headers.get('content-length');
    const lastModified = headResponse.headers.get('last-modified') || new Date().toUTCString();
    
    // ETag 생성
    const etag = `"${crypto.createHash('md5').update(imageUrl + lastModified).digest('hex')}"`;

    // 클라이언트의 조건부 요청 헤더 확인
    const ifNoneMatch = request.headers.get('if-none-match');
    const ifModifiedSince = request.headers.get('if-modified-since');

    if (ifNoneMatch === etag || (ifModifiedSince && new Date(ifModifiedSince) >= new Date(lastModified))) {
      cacheStats.hits++;
      
      return new NextResponse(null, { 
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Last-Modified': lastModified,
          'X-Cache-Status': 'HIT-CONDITIONAL',
        }
      });
    }

    // 실제 이미지 데이터 가져오기
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Blog Image Proxy)',
      },
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status });
    }

    // 이미지 데이터 가져오기
    const imageBuffer = await response.arrayBuffer();

    // 캐시 미스 통계 업데이트
    cacheStats.misses++;
    cacheStats.totalBytesServed += imageBuffer.byteLength;

    // 캐시 메타데이터 저장
    if (cacheKey && url.hostname.includes('amazonaws.com')) {
      imageMetaCache.set(cacheKey, {
        etag,
        contentType,
        lastModified,
        size: imageBuffer.byteLength,
        timestamp: Date.now(),
        hitCount: 0,
      });
    }

    // 이미지 반환 with 최적화된 캐시 헤더
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': imageBuffer.byteLength.toString(),
        'ETag': etag,
        'Last-Modified': lastModified,
        'Cache-Control': 'public, max-age=31536000, immutable, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept-Encoding',
        // 추가 최적화 헤더
        'X-Content-Type-Options': 'nosniff',
        'X-Cache-Status': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 