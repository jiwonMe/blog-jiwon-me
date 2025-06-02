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

// Helper function to get file URL from Notion file object
export function getFileUrl(file: any): string | null {
  if (!file) return null;
  
  if (file.type === 'external') {
    return file.external.url;
  } else if (file.type === 'file') {
    return file.file.url;
  }
  
  return null;
}

// Helper function to get color value
export function getColor(color: string): string {
  return color || 'default';
}

// Helper function to process rich text with annotations
export function richTextToMarkdown(richText: any[]): string {
  return richText?.map((text) => {
    let content = '';
    
    if (text.type === 'equation') {
      return `$${text.equation.expression}$`;
    }
    
    if (text.type === 'mention') {
      return getMentionContent(text.mention);
    }
    
    content = text.plain_text;
    
    // Apply annotations
    if (text.annotations) {
      if (text.annotations.bold) content = `**${content}**`;
      if (text.annotations.italic) content = `*${content}*`;
      if (text.annotations.strikethrough) content = `~~${content}~~`;
      if (text.annotations.underline) content = `<u>${content}</u>`;
      if (text.annotations.code) content = `\`${content}\``;
    }
    
    // Handle links
    if (text.href) {
      content = `[${content}](${text.href})`;
    }
    
    return content;
  }).join('') || '';
}

// Helper function to process table cells
export function processCells(cells: any[][]): string[] {
  return cells.map(cell => richTextToMarkdown(cell));
}

// Helper function to get mention content
export function getMentionContent(mention: any): string {
  switch (mention.type) {
    case 'user':
      return `@${mention.user.name || 'User'}`;
    case 'page':
      return `[Page](notion://page/${mention.page.id})`;
    case 'database':
      return `[Database](notion://database/${mention.database.id})`;
    case 'date':
      return mention.date.start;
    default:
      return '@mention';
  }
}

// Helper function to optimize image URLs for Next.js
export function optimizeImageUrl(url: string): string {
  if (!url) return url;
  
  // For Notion file URLs, proxy them through our API to avoid CORS issues
  if (url.includes('notion.so') || url.includes('amazonaws.com')) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  
  return url;
}

// Helper function to get embed URL
export function getEmbedUrl(embed: any): string {
  return embed?.url || '';
}

// Helper function to process bookmark
export function getBookmarkData(bookmark: any): { url: string; caption: string } {
  return {
    url: bookmark?.url || '',
    caption: bookmark?.caption ? getPlainText(bookmark.caption) : ''
  };
}

// Helper function to get link preview data
export function getLinkPreviewData(linkPreview: any): { url: string } {
  return {
    url: linkPreview?.url || ''
  };
}

// Helper function to get callout data
export function getCalloutData(callout: any): { icon: string; color: string; text: string } {
  let icon = '';
  if (callout?.icon) {
    if (callout.icon.type === 'emoji') {
      icon = callout.icon.emoji;
    } else if (callout.icon.type === 'external') {
      icon = callout.icon.external.url;
    } else if (callout.icon.type === 'file') {
      icon = callout.icon.file.url;
    }
  }
  
  return {
    icon,
    color: getColor(callout?.color),
    text: richTextToMarkdown(callout?.rich_text || [])
  };
}

// Helper function to get toggle data
export function getToggleData(toggle: any): { text: string; color: string } {
  return {
    text: richTextToMarkdown(toggle?.rich_text || []),
    color: getColor(toggle?.color)
  };
}

// Helper function to get to-do data
export function getToDoData(toDo: any): { text: string; checked: boolean; color: string } {
  return {
    text: richTextToMarkdown(toDo?.rich_text || []),
    checked: toDo?.checked || false,
    color: getColor(toDo?.color)
  };
}

// Helper function to get table data
export function getTableData(table: any): { tableWidth: number; hasColumnHeader: boolean; hasRowHeader: boolean } {
  return {
    tableWidth: table?.table_width || 0,
    hasColumnHeader: table?.has_column_header || false,
    hasRowHeader: table?.has_row_header || false
  };
}

// Helper function to get synced block data
export function getSyncedBlockData(syncedBlock: any): { syncedFrom: string | null; children: any[] } {
  return {
    syncedFrom: syncedBlock?.synced_from?.block_id || null,
    children: syncedBlock?.children || []
  };
} 