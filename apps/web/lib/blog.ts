import { notion, BLOG_DATABASE_ID, validateNotionConfig } from './notion';
import { BlogPost, isPageObjectResponse } from '../types/blog';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { getFallbackBlogPosts, getFallbackBlogPost, getFallbackTags } from './fallback-data';
import { unstable_cache } from 'next/cache';
import { notionPageToBlogPost, handleBlogError, safeProcessPage } from './blog/utils';
import { getPageContent, extractFirstImage } from './blog/markdown-processor';
import { CacheKey, CacheTag } from './blog/types';

// 캐시 설정 헬퍼
function createCacheConfig(key: CacheKey, revalidate: number, tags: CacheTag[]) {
  return {
    key: [key],
    revalidate,
    tags
  };
}

// 발행된 블로그 포스트 가져오기 (캐시됨)
export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      if (!validateNotionConfig()) {
        console.warn('Notion not configured, using fallback data');
        return getFallbackBlogPosts();
      }

      const response = await notion.databases.query({
        database_id: BLOG_DATABASE_ID,
        filter: {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
      });

      const posts: BlogPost[] = [];

      for (const page of response.results) {
        const processedPost = await safeProcessPage(
          page,
          async (page) => {
            if (!isPageObjectResponse(page)) {
              throw new Error('Invalid page response');
            }
            
            // 페이지 콘텐츠와 첫 번째 이미지 가져오기
            const [content, firstImageUrl] = await Promise.all([
              getPageContent(page.id),
              extractFirstImage(page.id)
            ]);
            
            return await notionPageToBlogPost(page, content, firstImageUrl || undefined);
          }
        );

        if (processedPost) {
          posts.push(processedPost);
        }
      }

      return posts;
    } catch (error) {
      handleBlogError(error, 'fetching blog posts');
      console.warn('Falling back to sample data');
      return getFallbackBlogPosts();
    }
  },
  ['blog-posts'],
  {
    revalidate: 3600, // 1시간
    tags: ['notion-blog', 'blog-posts']
  }
);

// 슬러그로 단일 블로그 포스트 가져오기 (캐시됨)
export const getBlogPost = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    try {
      if (!validateNotionConfig()) {
        console.warn('Notion not configured, using fallback data');
        return getFallbackBlogPost(slug);
      }

      const response = await notion.databases.query({
        database_id: BLOG_DATABASE_ID,
        filter: {
          and: [
            {
              property: 'Published',
              checkbox: {
                equals: true,
              },
            },
            {
              property: 'Slug',
              rich_text: {
                equals: slug,
              },
            },
          ],
        },
      });

      if (response.results.length === 0) {
        return null;
      }

      const page = response.results[0];
      if (!isPageObjectResponse(page)) {
        return null;
      }
      
      // 페이지 콘텐츠와 첫 번째 이미지 가져오기
      const [content, firstImageUrl] = await Promise.all([
        getPageContent(page.id),
        extractFirstImage(page.id)
      ]);
      
      return await notionPageToBlogPost(page, content, firstImageUrl || undefined);
    } catch (error) {
      handleBlogError(error, 'fetching blog post');
      console.warn('Falling back to sample data');
      return getFallbackBlogPost(slug);
    }
  },
  ['blog-post'],
  {
    revalidate: 7200, // 2시간
    tags: ['notion-blog']
  }
);

// 모든 고유 태그 가져오기 (캐시됨)
export const getAllTags = unstable_cache(
  async (): Promise<string[]> => {
    try {
      if (!validateNotionConfig()) {
        return getFallbackTags();
      }
      
      const posts = await getBlogPosts();
      const allTags = posts.flatMap(post => post.tags);
      return Array.from(new Set(allTags));
    } catch (error) {
      handleBlogError(error, 'fetching tags');
      return getFallbackTags();
    }
  },
  ['all-tags'],
  {
    revalidate: 3600, // 1시간
    tags: ['notion-blog', 'blog-tags']
  }
);

// 캐시된 페이지 콘텐츠 가져오기
export const getCachedPageContent = unstable_cache(
  getPageContent,
  ['page-content'],
  {
    revalidate: 7200, // 2시간
    tags: ['notion-content']
  }
);

// 캐시된 첫 번째 이미지 추출
export const getCachedFirstImage = unstable_cache(
  extractFirstImage,
  ['extract-first-image'],
  {
    revalidate: 3600, // 1시간
    tags: ['notion-images']
  }
);

// 유틸리티 함수들 재export (하위 호환성)
export { notionPageToBlogPost, handleBlogError, safeProcessPage } from './blog/utils';
export { getPageContent, extractFirstImage } from './blog/markdown-processor'; 