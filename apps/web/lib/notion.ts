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
  if (!mention || !mention.type) {
    return '@mention';
  }

  switch (mention.type) {
    case 'user':
      if (mention.user) {
        return `@${mention.user.name || mention.user.id || 'User'}`;
      }
      return '@User';
    case 'page':
      if (mention.page) {
        return `[Page](notion://page/${mention.page.id})`;
      }
      return '[Page]';
    case 'database':
      if (mention.database) {
        return `[Database](notion://database/${mention.database.id})`;
      }
      return '[Database]';
    case 'date':
      if (mention.date) {
        const start = mention.date.start;
        const end = mention.date.end;
        if (end) {
          return `${start} → ${end}`;
        }
        return start;
      }
      return '[Date]';
    case 'link_preview':
      if (mention.link_preview) {
        return `[${mention.link_preview.url}](${mention.link_preview.url})`;
      }
      return '[Link Preview]';
    case 'template_mention':
      if (mention.template_mention) {
        switch (mention.template_mention.type) {
          case 'template_mention_date':
            return mention.template_mention.template_mention_date || '[Date]';
          case 'template_mention_user':
            return mention.template_mention.template_mention_user || '[User]';
          default:
            return '[Template]';
        }
      }
      return '[Template]';
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

// Helper function to process all block types according to Notion API
export function getBlockTypeData(block: any): any {
  if (!block || !block.type) {
    return null;
  }

  const blockType = block.type;
  const blockData = block[blockType] || {};

  // Common properties for all blocks
  const commonData = {
    id: block.id,
    type: blockType,
    created_time: block.created_time,
    created_by: block.created_by,
    last_edited_time: block.last_edited_time,
    last_edited_by: block.last_edited_by,
    archived: block.archived,
    has_children: block.has_children,
    parent: block.parent,
  };

  // Type-specific data
  switch (blockType) {
    case 'paragraph':
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
    case 'bulleted_list_item':
    case 'numbered_list_item':
    case 'to_do':
    case 'toggle':
    case 'quote':
    case 'callout':
      return {
        ...commonData,
        rich_text: blockData.rich_text || [],
        color: blockData.color || 'default',
        ...(blockType === 'to_do' && { checked: blockData.checked || false }),
        ...(blockType === 'callout' && { icon: blockData.icon }),
        ...(blockType.startsWith('heading') && { is_toggleable: blockData.is_toggleable || false }),
      };

    case 'code':
      return {
        ...commonData,
        rich_text: blockData.rich_text || [],
        language: blockData.language || 'plain text',
        caption: blockData.caption || [],
      };

    case 'image':
    case 'video':
    case 'audio':
    case 'file':
    case 'pdf':
      return {
        ...commonData,
        type: blockData.type, // 'file' or 'external'
        file: blockData.file,
        external: blockData.external,
        caption: blockData.caption || [],
      };

    case 'bookmark':
    case 'link_preview':
    case 'embed':
      return {
        ...commonData,
        url: blockData.url || '',
        caption: blockData.caption || [],
      };

    case 'equation':
      return {
        ...commonData,
        expression: blockData.expression || '',
      };

    case 'divider':
      return commonData;

    case 'table':
      return {
        ...commonData,
        table_width: blockData.table_width || 0,
        has_column_header: blockData.has_column_header || false,
        has_row_header: blockData.has_row_header || false,
      };

    case 'table_row':
      return {
        ...commonData,
        cells: blockData.cells || [],
      };

    case 'column_list':
    case 'column':
      return commonData;

    case 'child_page':
      return {
        ...commonData,
        title: blockData.title || 'Untitled',
      };

    case 'child_database':
      return {
        ...commonData,
        title: blockData.title || 'Untitled Database',
      };

    case 'table_of_contents':
    case 'breadcrumb':
      return {
        ...commonData,
        color: blockData.color || 'default',
      };

    case 'link_to_page':
      return {
        ...commonData,
        type: blockData.type, // 'page_id' or 'database_id'
        page_id: blockData.page_id,
        database_id: blockData.database_id,
      };

    case 'synced_block':
      return {
        ...commonData,
        synced_from: blockData.synced_from,
      };

    case 'template':
      return {
        ...commonData,
        rich_text: blockData.rich_text || [],
      };

    case 'unsupported':
      return commonData;

    default:
      // For unknown block types, return what we can
      return {
        ...commonData,
        ...blockData,
      };
  }
}

// Helper function to handle pagination for block children
export async function getAllBlockChildren(blockId: string): Promise<any[]> {
  let allChildren: any[] = [];
  let hasMore = true;
  let nextCursor: string | undefined;

  while (hasMore) {
    try {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: nextCursor,
        page_size: 100, // Maximum allowed by Notion API
      });

      allChildren = allChildren.concat(response.results);
      hasMore = response.has_more;
      nextCursor = response.next_cursor || undefined;
    } catch (error) {
      console.error('Error fetching block children:', error);
      break;
    }
  }

  return allChildren;
}

// Helper function to get icon data
export function getIconData(icon: any): { type: string; emoji?: string; url?: string } {
  if (!icon) {
    return { type: 'emoji', emoji: '📄' };
  }

  switch (icon.type) {
    case 'emoji':
      return { type: 'emoji', emoji: icon.emoji };
    case 'external':
      return { type: 'external', url: icon.external.url };
    case 'file':
      return { type: 'file', url: icon.file.url };
    default:
      return { type: 'emoji', emoji: '📄' };
  }
} 