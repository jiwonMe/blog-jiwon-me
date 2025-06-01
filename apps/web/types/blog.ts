export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  slug: string;
  tags: string[];
  readTime: string;
  coverImage?: string;
  published: boolean;
}

import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  slug: string;
  tags: string[];
  readTime: string;
  coverImage?: string;
  published: boolean;
}

// Type guard to check if a page is a PageObjectResponse
export function isPageObjectResponse(page: any): page is PageObjectResponse {
  return page && 'properties' in page && page.object === 'page';
} 