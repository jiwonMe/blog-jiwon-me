import { Client } from '@notionhq/client';

// Notion 클라이언트 초기화
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// 환경 변수 검증
export const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID || '';

// Notion 설정 검증 함수
export function validateNotionConfig(): boolean {
  return !!(BLOG_DATABASE_ID && process.env.NOTION_TOKEN);
}

// 에러 처리를 위한 유틸리티
export function isNotionError(error: any): boolean {
  return error?.code && error?.message && error?.status;
}

// Notion API 에러 메시지 포맷팅
export function formatNotionError(error: any): string {
  if (isNotionError(error)) {
    return `Notion API Error (${error.status}): ${error.message}`;
  }
  return error?.message || 'Unknown Notion error';
} 