import { Client } from '@notionhq/client';

// Initialize Notion client
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Notion database ID for blog posts
export const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID || '';

// Helper function to get plain text from Notion rich text with equation support
export function getPlainText(richText: any[]): string {
  return richText?.map((text) => {
    if (text.type === 'equation') {
      // Inline equation - wrap in $ for LaTeX
      return `$${text.equation.expression}$`;
    }
    return text.plain_text;
  }).join('') || '';
}

// Helper function to get date string from Notion date property
export function getDateString(date: any): string {
  return date?.start || '';
}

// Helper function to get tags from Notion multi-select property
export function getTags(multiSelect: any[]): string[] {
  return multiSelect?.map((tag) => tag.name) || [];
}

// Helper function to calculate read time based on content length
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes}분`;
}

// Helper function to extract cover image URL
export function getCoverImage(cover: any): string | null {
  if (!cover) return null;
  
  if (cover.type === 'external') {
    return cover.external.url;
  } else if (cover.type === 'file') {
    return cover.file.url;
  }
  
  return null;
} 