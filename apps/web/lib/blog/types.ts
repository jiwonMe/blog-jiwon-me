import { BlogPost } from '../../types/blog';

// 블로그 포스트 처리 옵션
export interface BlogPostProcessingOptions {
  includeContent: boolean;
  includeFirstImage: boolean;
  generateThumbnail: boolean;
  maxExcerptLength: number;
}

// 블로그 포스트 변환 결과
export interface BlogPostConversionResult {
  post: BlogPost;
  errors: string[];
  warnings: string[];
}

// 캐시 키 타입
export type CacheKey = 
  | 'blog-posts'
  | 'blog-post'
  | 'page-content'
  | 'extract-first-image'
  | 'all-tags';

// 캐시 태그 타입
export type CacheTag = 
  | 'notion-blog'
  | 'notion-content'
  | 'notion-images'
  | 'blog-posts'
  | 'blog-tags';

// 디버그 정보 타입
export interface BlogPostDebugInfo {
  notionPage: any;
  rawContent: string;
  firstImageUrl?: string;
  extractedData: {
    title: string;
    slug: string;
    excerpt: string;
    date: string;
    tags: string[];
    published: boolean;
    coverImage?: string;
  };
  contentStats: {
    contentLength: number;
    wordCount: number;
    readTime: string;
  };
  timestamps: {
    created: string;
    lastEdited: string;
    processed: string;
  };
} 