import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { 
  getPlainText, 
  getDateString, 
  getTags, 
  generateExcerptFromContent,
  calculateReadTime,
  getCoverImage,
  optimizeImageUrl,
  generateThumbnail
} from '../notion';
import { BlogPost } from '../../types/blog';
import { BlogPostDebugInfo } from './types';

// Notion 페이지에서 속성 추출 함수들
export function getTitle(page: PageObjectResponse): string {
  const titleProp = page.properties.Title;
  if (titleProp && titleProp.type === 'title') {
    return getPlainText(titleProp.title as any);
  }
  return '';
}

export function getSlug(page: PageObjectResponse): string {
  const slugProp = page.properties.Slug;
  if (slugProp && slugProp.type === 'rich_text') {
    return getPlainText(slugProp.rich_text as any);
  }
  return '';
}

export function getExcerpt(page: PageObjectResponse): string {
  const excerptProp = page.properties.Excerpt;
  if (excerptProp && excerptProp.type === 'rich_text') {
    return getPlainText(excerptProp.rich_text as any);
  }
  return '';
}

export function getDate(page: PageObjectResponse): string {
  const dateProp = page.properties.Date;
  if (dateProp && dateProp.type === 'date') {
    return getDateString(dateProp.date);
  }
  return '';
}

export function getTagsFromPage(page: PageObjectResponse): string[] {
  const tagsProp = page.properties.Tags;
  if (tagsProp && tagsProp.type === 'multi_select') {
    return getTags(tagsProp.multi_select);
  }
  return [];
}

export function getPublished(page: PageObjectResponse): boolean {
  const publishedProp = page.properties.Published;
  if (publishedProp && publishedProp.type === 'checkbox') {
    return publishedProp.checkbox;
  }
  return false;
}

// Notion 페이지를 BlogPost로 변환
export async function notionPageToBlogPost(
  page: PageObjectResponse, 
  content: string, 
  firstImageUrl?: string
): Promise<BlogPost> {
  const title = getTitle(page);
  const slug = getSlug(page);
  let excerpt = getExcerpt(page);
  const date = getDate(page);
  const tags = getTagsFromPage(page);
  const published = getPublished(page);
  
  // 요약이 없으면 콘텐츠에서 생성
  if (!excerpt && content) {
    excerpt = generateExcerptFromContent(content);
  }
  
  // 썸네일 우선순위: 1. 커버 이미지, 2. 첫 번째 이미지, 3. 자동 생성
  let thumbnail = getCoverImage(page.cover);
  if (thumbnail) {
    thumbnail = optimizeImageUrl(thumbnail);
  } else if (firstImageUrl) {
    thumbnail = firstImageUrl;
  }
  
  const readTime = calculateReadTime(content);

  const blogPost: BlogPost = {
    id: page.id,
    title,
    slug,
    excerpt,
    content,
    date,
    tags,
    readTime,
    coverImage: thumbnail || undefined,
    published,
  };

  // 개발 환경에서 디버그 정보 추가
  if (process.env.NODE_ENV === 'development') {
    (blogPost as any)._debug = createDebugInfo(page, content, firstImageUrl, {
      title,
      slug,
      excerpt,
      date,
      tags,
      published,
      coverImage: thumbnail,
    }, readTime);
  }

  return blogPost;
}

// 디버그 정보 생성
function createDebugInfo(
  page: PageObjectResponse,
  content: string,
  firstImageUrl?: string,
  extractedData?: any,
  readTime?: string
): BlogPostDebugInfo {
  return {
    notionPage: page,
    rawContent: content,
    firstImageUrl,
    extractedData: extractedData || {},
    contentStats: {
      contentLength: content.length,
      wordCount: content.split(/\s+/).length,
      readTime: readTime || '',
    },
    timestamps: {
      created: page.created_time,
      lastEdited: page.last_edited_time,
      processed: new Date().toISOString(),
    }
  };
}

// 에러 처리 유틸리티
export function handleBlogError(error: any, context: string): void {
  console.error(`Error in ${context}:`, error);
  
  // 개발 환경에서 더 자세한 에러 정보 출력
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

// 안전한 페이지 처리 (에러가 발생해도 다른 페이지 처리 계속)
export async function safeProcessPage<T>(
  page: any,
  processor: (page: any) => Promise<T>,
  fallback?: T
): Promise<T | null> {
  try {
    return await processor(page);
  } catch (error) {
    handleBlogError(error, `processing page ${page.id}`);
    return fallback || null;
  }
} 