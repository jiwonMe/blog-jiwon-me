import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// Notion 블록 타입 정의
export interface NotionBlock {
  id: string;
  type: string;
  has_children: boolean;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  parent: any;
  [key: string]: any;
}

// Notion 리치 텍스트 타입
export interface NotionRichText {
  type: 'text' | 'mention' | 'equation';
  text?: {
    content: string;
    link?: {
      url: string;
    };
  };
  mention?: any;
  equation?: {
    expression: string;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string;
}

// Notion 페이지 속성 타입
export interface NotionPageProperties {
  Title: {
    type: 'title';
    title: NotionRichText[];
  };
  Slug: {
    type: 'rich_text';
    rich_text: NotionRichText[];
  };
  Excerpt: {
    type: 'rich_text';
    rich_text: NotionRichText[];
  };
  Date: {
    type: 'date';
    date: {
      start: string;
      end?: string;
    } | null;
  };
  Tags: {
    type: 'multi_select';
    multi_select: Array<{
      id: string;
      name: string;
      color: string;
    }>;
  };
  Published: {
    type: 'checkbox';
    checkbox: boolean;
  };
}

// 타입 가드 함수들
export function isPageObjectResponse(page: any): page is PageObjectResponse {
  return page && 'properties' in page && page.object === 'page';
}

export function isNotionRichText(obj: any): obj is NotionRichText {
  return obj && typeof obj === 'object' && 'type' in obj && 'plain_text' in obj;
}

// Notion 색상 타입
export type NotionColor = 
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'green_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background';

// 블록 처리 결과 타입
export interface BlockProcessingResult {
  content: string;
  hasChildren: boolean;
  error?: string;
}

// 캐시 설정 타입
export interface CacheConfig {
  revalidate: number;
  tags: string[];
} 