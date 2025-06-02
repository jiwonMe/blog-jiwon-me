import { 
  notion, 
  BLOG_DATABASE_ID, 
  getPlainText, 
  getDateString, 
  getTags, 
  calculateReadTime, 
  getCoverImage,
  getFileUrl,
  processCells,
  getMentionContent,
  optimizeImageUrl,
  getEmbedUrl,
  getBookmarkData,
  getLinkPreviewData,
  getCalloutData,
  getToggleData,
  getToDoData,
  getTableData,
  getSyncedBlockData,
  getBlockTypeData,
  getAllBlockChildren,
  getIconData
} from './notion';
import { BlogPost, isPageObjectResponse } from '../types/blog';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { getFallbackBlogPosts, getFallbackBlogPost, getFallbackTags } from './fallback-data';
import { unstable_cache } from 'next/cache';

// Generate automatic thumbnail using a placeholder service
async function generateThumbnail(title: string, tags: string[]): Promise<string> {
  // Using a simple placeholder service with customization
  const encodedTitle = encodeURIComponent(title.slice(0, 50)); // Limit title length
  const primaryTag = tags[0] || 'Blog';
  
  // Using DiceBear for more attractive placeholder images
  // Alternative: Use a simple colored background with title
  const backgroundColor = getColorFromTag(primaryTag);
  return `https://via.placeholder.com/1200x630/${backgroundColor}/FFFFFF?text=${encodedTitle}`;
}

// Get color based on tag for consistent theming
function getColorFromTag(tag: string): string {
  const colors = {
    'Next.js': '000000',
    'React': '61DAFB',
    'TypeScript': '3178C6',
    'JavaScript': 'F7DF1E',
    'Node.js': '339933',
    'CSS': '1572B6',
    'HTML': 'E34F26',
    'Vue': '4FC08D',
    'Angular': 'DD0031',
    'Python': '3776AB',
    'Java': 'ED8B00',
    'Go': '00ADD8',
    'Rust': '000000',
    'PHP': '777BB4',
    'Ruby': 'CC342D',
    'Swift': 'FA7343',
    'Kotlin': '0095D5',
    'C++': '00599C',
    'C#': '239120',
    'DevOps': 'FF6B6B',
    'AWS': 'FF9900',
    'Docker': '2496ED',
    'Kubernetes': '326CE5',
    'Git': 'F05032',
    'Linux': 'FCC624',
    'Database': '336791',
    'API': '4CAF50',
    'Frontend': 'FF69B4',
    'Backend': '8A2BE2',
    'Mobile': 'FF4081',
    'Web': '2196F3',
    'Design': 'E91E63',
    'UI/UX': 'FF5722',
    'Testing': '9C27B0',
    'Security': 'F44336',
    'Performance': 'FF9800',
    'Tutorial': '4CAF50',
    'Guide': '2196F3',
    'Tips': 'FF5722',
    'News': 'FF9800',
    'Review': '9C27B0',
    'Opinion': '607D8B',
    'Blog': '4F46E5',
  };
  
  return colors[tag as keyof typeof colors] || '4F46E5'; // Default purple
}

// Extract first image URL from content blocks (cached)
const extractFirstImage = unstable_cache(
  async (pageId: string): Promise<string | null> => {
    try {
      const response = await notion.blocks.children.list({
        block_id: pageId,
      });

      for (const block of response.results) {
        if ('type' in block && block.type === 'image') {
          const imageBlock = block as any;
          const imageUrl = getFileUrl(imageBlock.image);
          return imageUrl ? optimizeImageUrl(imageUrl) : null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting first image:', error);
      return null;
    }
  },
  ['extract-first-image'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['notion-images']
  }
);

// Helper functions to safely extract properties
function getTitle(page: PageObjectResponse): string {
  const titleProp = page.properties.Title;
  if (titleProp && titleProp.type === 'title') {
    return getPlainText(titleProp.title);
  }
  return '';
}

function getSlug(page: PageObjectResponse): string {
  const slugProp = page.properties.Slug;
  if (slugProp && slugProp.type === 'rich_text') {
    return getPlainText(slugProp.rich_text);
  }
  return '';
}

function getExcerpt(page: PageObjectResponse): string {
  const excerptProp = page.properties.Excerpt;
  if (excerptProp && excerptProp.type === 'rich_text') {
    return getPlainText(excerptProp.rich_text);
  }
  return '';
}

function getDate(page: PageObjectResponse): string {
  const dateProp = page.properties.Date;
  if (dateProp && dateProp.type === 'date') {
    return getDateString(dateProp.date);
  }
  return '';
}

function getTagsFromPage(page: PageObjectResponse): string[] {
  const tagsProp = page.properties.Tags;
  if (tagsProp && tagsProp.type === 'multi_select') {
    return getTags(tagsProp.multi_select);
  }
  return [];
}

function getPublished(page: PageObjectResponse): boolean {
  const publishedProp = page.properties.Published;
  if (publishedProp && publishedProp.type === 'checkbox') {
    return publishedProp.checkbox;
  }
  return false;
}

// Generate excerpt from content if not provided
function generateExcerptFromContent(content: string, maxLength: number = 200): string {
  // Remove markdown formatting and get plain text
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\$\$([\s\S]*?)\$\$/g, '') // Remove block equations
    .replace(/\$(.*?)\$/g, '') // Remove inline equations
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/>\s+/g, '') // Remove quotes
    .replace(/[-*+]\s+/g, '') // Remove list markers
    .replace(/\d+\.\s+/g, '') // Remove numbered list markers
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  // Truncate to maxLength and add ellipsis if needed
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

// Convert Notion page to BlogPost
async function notionPageToBlogPost(page: PageObjectResponse, content: string, firstImageUrl?: string): Promise<BlogPost> {
  const title = getTitle(page);
  const slug = getSlug(page);
  let excerpt = getExcerpt(page);
  const date = getDate(page);
  const tags = getTagsFromPage(page);
  const published = getPublished(page);
  
  // If no excerpt is provided, generate one from content
  if (!excerpt && content) {
    excerpt = generateExcerptFromContent(content);
  }
  
  // Thumbnail priority: 1. Cover image, 2. First image in content, 3. Auto-generated (optional)
  let thumbnail = getCoverImage(page.cover);
  if (thumbnail) {
    thumbnail = optimizeImageUrl(thumbnail);
  } else if (firstImageUrl) {
    thumbnail = firstImageUrl; // Already optimized in extractFirstImage
  }
  // Note: Auto-generated thumbnails are handled in the UI layer for better performance
  // if (!thumbnail) {
  //   thumbnail = await generateThumbnail(title, tags);
  // }
  
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

  // Add debug information in development
  if (process.env.NODE_ENV === 'development') {
    (blogPost as any)._debug = {
      notionPage: page,
      rawContent: content,
      firstImageUrl,
      extractedData: {
        title: getTitle(page),
        slug: getSlug(page),
        excerpt: getExcerpt(page),
        date: getDate(page),
        tags: getTagsFromPage(page),
        published: getPublished(page),
        coverImage: getCoverImage(page.cover),
      },
      contentStats: {
        contentLength: content.length,
        wordCount: content.split(/\s+/).length,
        readTime,
      },
      timestamps: {
        created: page.created_time,
        lastEdited: page.last_edited_time,
        processed: new Date().toISOString(),
      }
    };
  }

  return blogPost;
}

// Fetch all published blog posts (cached)
export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      if (!BLOG_DATABASE_ID || !process.env.NOTION_TOKEN) {
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
        try {
          if (!isPageObjectResponse(page)) {
            continue;
          }
          // Get page content and first image
          const content = await getPageContent(page.id);
          const firstImageUrl = await extractFirstImage(page.id);
          const blogPost = await notionPageToBlogPost(page, content, firstImageUrl || undefined);
          posts.push(blogPost);
        } catch (error) {
          console.error(`Error processing page ${page.id}:`, error);
          // Continue with other pages even if one fails
        }
      }

      return posts;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      console.warn('Falling back to sample data');
      return getFallbackBlogPosts();
    }
  },
  ['blog-posts'],
  {
    revalidate: 3600, // 1시간으로 연장 (30분 → 1시간)
    tags: ['notion-blog', 'blog-posts']
  }
);

// Fetch a single blog post by slug (cached)
export const getBlogPost = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    try {
      if (!BLOG_DATABASE_ID || !process.env.NOTION_TOKEN) {
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
      
      const content = await getPageContent(page.id);
      const firstImageUrl = await extractFirstImage(page.id);
      
      return await notionPageToBlogPost(page, content, firstImageUrl || undefined);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      console.warn('Falling back to sample data');
      return getFallbackBlogPost(slug);
    }
  },
  ['blog-post'],
  {
    revalidate: 7200, // 2시간으로 연장 (1시간 → 2시간)
    tags: ['notion-blog']
  }
);

// Get page content as markdown (cached)
export const getPageContent = unstable_cache(
  async (pageId: string): Promise<string> => {
    try {
      const response = await notion.blocks.children.list({
        block_id: pageId,
      });

      let content = '';
      
      for (const block of response.results) {
        try {
          content += await blockToMarkdown(block);
        } catch (blockError) {
          console.error(`Error processing block ${block.id}:`, blockError);
          // Continue with other blocks even if one fails
          const blockType = 'type' in block ? block.type : 'unknown';
          content += `[Error processing block: ${blockType}]\n\n`;
        }
      }

      return content;
    } catch (error) {
      console.error('Error fetching page content:', error);
      return '';
    }
  },
  ['page-content'],
  {
    revalidate: 7200, // 2시간으로 연장 (1시간 → 2시간)
    tags: ['notion-content']
  }
);

// Process nested children blocks with pagination support
async function processChildren(blockId: string, indent: string = ''): Promise<string> {
  try {
    // Use the helper function that handles pagination
    const children = await getAllBlockChildren(blockId);

    let content = '';
    for (const child of children) {
      const childContent = await blockToMarkdown(child, indent);
      content += childContent;
    }
    
    return content;
  } catch (error) {
    console.error('Error processing children blocks:', error);
    return '';
  }
}

// Convert rich text to markdown with proper annotation support
function richTextToMarkdownWithAnnotations(richTextArray: any[]): string {
  if (!richTextArray || !Array.isArray(richTextArray)) {
    return '';
  }

  return richTextArray.map(richText => {
    if (!richText || typeof richText !== 'object') {
      return '';
    }

    let text = '';
    
    // Extract text content based on type
    if (richText.type === 'text') {
      text = richText.text?.content || '';
    } else if (richText.type === 'mention') {
      text = getMentionContent(richText);
    } else if (richText.type === 'equation') {
      text = `$${richText.equation?.expression || ''}$`;
    } else {
      text = richText.plain_text || '';
    }

    // Apply annotations
    const annotations = richText.annotations || {};
    
    if (annotations.bold) {
      text = `**${text}**`;
    }
    if (annotations.italic) {
      text = `*${text}*`;
    }
    if (annotations.strikethrough) {
      text = `~~${text}~~`;
    }
    if (annotations.underline) {
      text = `<u>${text}</u>`;
    }
    if (annotations.code) {
      text = `\`${text}\``;
    }
    
    // Handle colors
    if (annotations.color && annotations.color !== 'default') {
      const colorClass = `notion-${annotations.color}`;
      text = `<span class="${colorClass}">${text}</span>`;
    }

    // Handle links
    if (richText.href || (richText.text && richText.text.link)) {
      const url = richText.href || richText.text.link.url;
      text = `[${text}](${url})`;
    }

    return text;
  }).join('');
}

// Convert Notion block to markdown with support for all block types
async function blockToMarkdown(block: any, indent: string = ''): Promise<string> {
  if (!block || !block.type) {
    return '';
  }

  const { type, has_children } = block;
  const blockData = block[type] || {};
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Processing block: ${type}`, {
      id: block.id,
      type,
      has_children,
      blockData: Object.keys(blockData),
    });
  }
  
  try {
    switch (type) {
      case 'paragraph':
        const paragraphText = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        let paragraphContent = `${paragraphText}\n\n`;
        
        if (has_children) {
          const childrenContent = await processChildren(block.id, indent);
          paragraphContent += childrenContent;
        }
        return paragraphContent;
      
      case 'heading_1':
        const h1Text = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        const h1Color = blockData.color !== 'default' ? ` {.notion-${blockData.color}}` : '';
        const h1Toggleable = blockData.is_toggleable ? '\n\n:::toggle-heading{level="1"}\n' : '';
        
        let h1Content = `# ${h1Text}${h1Color}\n\n`;
        if (h1Toggleable) {
          h1Content = `${h1Toggleable}${h1Content}`;
        }
        
        if (has_children) {
          const childrenContent = await processChildren(block.id, indent);
          h1Content += childrenContent;
          if (h1Toggleable) {
            h1Content += ':::\n\n';
          }
        }
        return h1Content;
      
      case 'heading_2':
        const h2Text = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        const h2Color = blockData.color !== 'default' ? ` {.notion-${blockData.color}}` : '';
        const h2Toggleable = blockData.is_toggleable ? '\n\n:::toggle-heading{level="2"}\n' : '';
        
        let h2Content = `## ${h2Text}${h2Color}\n\n`;
        if (h2Toggleable) {
          h2Content = `${h2Toggleable}${h2Content}`;
        }
        
        if (has_children) {
          const childrenContent = await processChildren(block.id, indent);
          h2Content += childrenContent;
          if (h2Toggleable) {
            h2Content += ':::\n\n';
          }
        }
        return h2Content;
      
      case 'heading_3':
        const h3Text = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        const h3Color = blockData.color !== 'default' ? ` {.notion-${blockData.color}}` : '';
        const h3Toggleable = blockData.is_toggleable ? '\n\n:::toggle-heading{level="3"}\n' : '';
        
        let h3Content = `### ${h3Text}${h3Color}\n\n`;
        if (h3Toggleable) {
          h3Content = `${h3Toggleable}${h3Content}`;
        }
        
        if (has_children) {
          const childrenContent = await processChildren(block.id, indent);
          h3Content += childrenContent;
          if (h3Toggleable) {
            h3Content += ':::\n\n';
          }
        }
        return h3Content;
      
      case 'bulleted_list_item':
        const bulletText = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        const bulletColor = blockData.color !== 'default' ? ` {.notion-${blockData.color}}` : '';
        
        let bulletContent = `${indent}- ${bulletText}${bulletColor}\n`;
        if (has_children) {
          const childrenContent = await processChildren(block.id, indent + '  ');
          bulletContent += childrenContent;
        }
        return bulletContent;
      
      case 'numbered_list_item':
        const numberedText = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        const numberedColor = blockData.color !== 'default' ? ` {.notion-${blockData.color}}` : '';
        
        let numberedContent = `${indent}1. ${numberedText}${numberedColor}\n`;
        if (has_children) {
          const childrenContent = await processChildren(block.id, indent + '   ');
          numberedContent += childrenContent;
        }
        return numberedContent;
      
      case 'to_do':
        const todoText = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        const todoChecked = blockData.checked || false;
        const todoColor = blockData.color !== 'default' ? ` {.notion-${blockData.color}}` : '';
        const checkbox = todoChecked ? '[x]' : '[ ]';
        
        let todoContent = `${indent}${checkbox} ${todoText}${todoColor}\n`;
        if (has_children) {
          const childrenContent = await processChildren(block.id, indent + '  ');
          todoContent += childrenContent;
        }
        return todoContent;
      
      case 'toggle':
        const toggleText = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        const toggleColor = blockData.color !== 'default' ? ` {.notion-${blockData.color}}` : '';
        
        let toggleContent = `:::toggle{summary="${toggleText}"${toggleColor ? ` color="${blockData.color}"` : ''}}\n`;
        if (has_children) {
          const childrenContent = await processChildren(block.id, indent);
          toggleContent += childrenContent;
        }
        toggleContent += ':::\n\n';
        return toggleContent;
      
      case 'code':
        const codeText = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        const language = blockData.language || '';
        const caption = blockData.caption ? richTextToMarkdownWithAnnotations(blockData.caption) : '';
        
        let codeContent = `\`\`\`${language}\n${codeText}\n\`\`\`\n`;
        if (caption) {
          codeContent += `*${caption}*\n`;
        }
        return codeContent + '\n';
      
      case 'quote':
        const quoteText = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        const quoteColor = blockData.color !== 'default' ? ` {.notion-${blockData.color}}` : '';
        
        let quoteContent = `> ${quoteText}${quoteColor}\n\n`;
        if (has_children) {
          const childrenContent = await processChildren(block.id, '> ');
          quoteContent += childrenContent;
        }
        return quoteContent;
      
      case 'callout':
        const calloutText = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        const iconData = getIconData(blockData.icon);
        const calloutIcon = iconData.emoji || iconData.url || '💡';
        const calloutColor = blockData.color !== 'default' ? blockData.color : 'default';
        
        let calloutContent = `:::callout{icon="${calloutIcon}" color="${calloutColor}"}\n${calloutText}\n`;
        if (has_children) {
          const childrenContent = await processChildren(block.id, '');
          calloutContent += childrenContent;
        }
        calloutContent += ':::\n\n';
        return calloutContent;
      
      case 'divider':
        return '---\n\n';
      
      case 'image':
        const imageUrl = optimizeImageUrl(getFileUrl(blockData) || '');
        const imageCaption = blockData.caption ? richTextToMarkdownWithAnnotations(blockData.caption) : '';
        return `![${imageCaption}](${imageUrl})\n\n`;
      
      case 'video':
        const videoUrl = getFileUrl(blockData) || '';
        const videoCaption = blockData.caption ? richTextToMarkdownWithAnnotations(blockData.caption) : 'Video';
        return `:::video{url="${videoUrl}" title="${videoCaption}"}\n:::\n\n`;
      
      case 'audio':
        const audioUrl = getFileUrl(blockData) || '';
        const audioCaption = blockData.caption ? richTextToMarkdownWithAnnotations(blockData.caption) : 'Audio';
        return `:::audio{url="${audioUrl}" title="${audioCaption}"}\n:::\n\n`;
      
      case 'file':
        const fileUrl = getFileUrl(blockData) || '';
        const fileCaption = blockData.caption ? richTextToMarkdownWithAnnotations(blockData.caption) : 'File';
        return `:::file{url="${fileUrl}" title="${fileCaption}"}\n:::\n\n`;
      
      case 'pdf':
        const pdfUrl = getFileUrl(blockData) || '';
        const pdfCaption = blockData.caption ? richTextToMarkdownWithAnnotations(blockData.caption) : 'PDF';
        return `:::file{url="${pdfUrl}" title="${pdfCaption}"}\n:::\n\n`;
      
      case 'bookmark':
        const bookmarkUrl = blockData.url || '';
        const bookmarkCaption = blockData.caption ? richTextToMarkdownWithAnnotations(blockData.caption) : 'Bookmark';
        return `[${bookmarkCaption}](${bookmarkUrl})\n\n`;
      
      case 'link_preview':
        const linkPreviewUrl = blockData.url || '';
        return `[Link Preview](${linkPreviewUrl})\n\n`;
      
      case 'embed':
        const embedUrl = blockData.url || '';
        const embedCaption = blockData.caption ? richTextToMarkdownWithAnnotations(blockData.caption) : '';
        return `:::embed{url="${embedUrl}" caption="${embedCaption}"}\n:::\n\n`;
      
      case 'equation':
        return `$$${blockData.expression || ''}$$\n\n`;
      
      case 'table':
        const tableWidth = blockData.table_width || 0;
        const hasColumnHeader = blockData.has_column_header || false;
        const hasRowHeader = blockData.has_row_header || false;
        
        try {
          // Use pagination-aware function to get all table rows
          const allChildren = await getAllBlockChildren(block.id);
          
          let tableMarkdown = '';
          const rows = allChildren.filter((row: any) => row.type === 'table_row');
          
          // Debug logging for table processing
          if (process.env.NODE_ENV === 'development') {
            console.log('Table processing:', {
              tableWidth,
              hasColumnHeader,
              hasRowHeader,
              rowsCount: rows.length,
              blockId: block.id
            });
          }
          
          if (rows.length > 0) {
            rows.forEach((row: any, rowIndex: number) => {
              // Process each cell in the row
              const cells: string[] = [];
              
              // Get actual number of cells from the row data, fallback to table_width
              const actualCellCount = row.table_row?.cells?.length || tableWidth;
              const cellCount = Math.max(actualCellCount, tableWidth);
              
              for (let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
                try {
                  const cellData = row.table_row?.cells?.[cellIndex];
                  if (cellData && Array.isArray(cellData)) {
                    // Each cell is an array of rich text objects
                    const cellContent = richTextToMarkdownWithAnnotations(cellData);
                    // Escape pipe characters, handle empty cells, and preserve Korean text
                    let safeCellContent = (cellContent || '').replace(/\|/g, '\\|').trim();
                    
                    // Ensure non-empty cells for proper table rendering
                    if (!safeCellContent) {
                      safeCellContent = ' '; // Use regular space for empty cells
                    }
                    
                    // Debug logging for cell content
                    if (process.env.NODE_ENV === 'development' && rowIndex < 3) {
                      console.log(`Cell [${rowIndex}][${cellIndex}]:`, {
                        original: cellData,
                        processed: cellContent,
                        safe: safeCellContent
                      });
                    }
                    
                    cells.push(safeCellContent);
                  } else {
                    // Empty cell
                    cells.push(' ');
                  }
                } catch (cellError) {
                  console.warn(`Error processing table cell [${rowIndex}][${cellIndex}]:`, cellError);
                  cells.push(' ');
                }
              }
              
              // Create table row with proper spacing
              tableMarkdown += `| ${cells.join(' | ')} |\n`;
              
              // Add header separator after first row if it has column headers
              if (rowIndex === 0 && hasColumnHeader) {
                const separators = cells.map((_: string, cellIndex: number) => {
                  // Left align first column if it's a row header
                  if (cellIndex === 0 && hasRowHeader) {
                    return ':---';
                  }
                  // Left align for better Korean text readability
                  return '---';
                });
                tableMarkdown += `| ${separators.join(' | ')} |\n`;
              }
            });
          } else {
            // Empty table fallback
            const emptyCells = Array(tableWidth).fill(' ');
            tableMarkdown = `| ${emptyCells.join(' | ')} |\n`;
            if (hasColumnHeader) {
              const separators = Array(tableWidth).fill('---');
              tableMarkdown += `| ${separators.join(' | ')} |\n`;
            }
          }
          
          // Add extra newlines for proper markdown spacing
          return `\n${tableMarkdown}\n`;
        } catch (error) {
          console.error('Error processing table:', error);
          return `\n**[Table with ${tableWidth} columns${hasColumnHeader ? ' (with headers)' : ''}${hasRowHeader ? ' (with row headers)' : ''}]**\n\n`;
        }
      
      case 'table_row':
        // Table rows are handled by their parent table block
        // This case should not be reached in normal processing
        return '';
      
      case 'column_list':
        let columnListContent = '\n:::columns\n';
        if (has_children) {
          columnListContent += await processChildren(block.id, '');
        }
        columnListContent += ':::\n\n';
        return columnListContent;
      
      case 'column':
        let columnContent = ':::column\n';
        if (has_children) {
          columnContent += await processChildren(block.id, '');
        }
        columnContent += ':::\n';
        return columnContent;
      
      case 'child_page':
        const pageTitle = blockData.title || 'Untitled';
        return `[📄 ${pageTitle}](notion://page/${block.id})\n\n`;
      
      case 'child_database':
        const dbTitle = blockData.title || 'Untitled Database';
        return `[🗃️ ${dbTitle}](notion://database/${block.id})\n\n`;
      
      case 'table_of_contents':
        const tocColorClass = blockData.color !== 'default' ? ` {.notion-${blockData.color}}` : '';
        return `[📋 Table of Contents]${tocColorClass}\n\n`;
      
      case 'breadcrumb':
        return `[🍞 Breadcrumb]\n\n`;
      
      case 'link_to_page':
        const linkType = blockData.type;
        const linkId = blockData[linkType];
        return `[🔗 Link to ${linkType}](notion://${linkType}/${linkId})\n\n`;
      
      case 'synced_block':
        const syncedFrom = blockData.synced_from;
        if (syncedFrom) {
          const syncedBlockId = syncedFrom.block_id;
          return `[🔄 Synced from: ${syncedBlockId}]\n\n`;
        } else {
          // Original synced block - process children
          let syncedContent = '';
          if (has_children) {
            syncedContent += await processChildren(block.id, indent);
          }
          return syncedContent;
        }
      
      case 'template':
        const templateText = richTextToMarkdownWithAnnotations(blockData.rich_text || []);
        let templateContent = `:::template{title="${templateText}"}\n`;
        if (has_children) {
          templateContent += await processChildren(block.id, '');
        }
        templateContent += ':::\n\n';
        return templateContent;
      
      case 'unsupported':
        return `[❌ Unsupported block type]\n\n`;
      
      // Additional block types from Notion API
      case 'ai_block':
        return `[🤖 AI Block]\n\n`;
      
      case 'breadcrumb':
        return `:::breadcrumb\n:::\n\n`;
      
      // Handle rich text blocks that might have been missed
      case 'rich_text':
        if (blockData.rich_text) {
          const richTextContent = richTextToMarkdownWithAnnotations(blockData.rich_text);
          return `${richTextContent}\n\n`;
        }
        return '';
      
      // Handle any block with rich_text property
      default:
        // For any other block types, try to extract text if available
        if (blockData.rich_text) {
          const text = richTextToMarkdownWithAnnotations(blockData.rich_text);
          const color = blockData.color !== 'default' ? ` {.notion-${blockData.color}}` : '';
          return `${text}${color}\n\n`;
        }
        
        // Log unknown block types for debugging
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Unknown block type: ${type}`, {
            blockId: block.id,
            blockData: Object.keys(blockData),
            block
          });
        }
        
        return `[⚠️ Unknown block type: ${type}]\n\n`;
    }
  } catch (error) {
    console.error('Error processing block:', error);
    return `[⚠️ Error processing block: ${type}]\n\n`;
  }
}

// Get all unique tags from published posts (cached)
export const getAllTags = unstable_cache(
  async (): Promise<string[]> => {
    try {
      if (!BLOG_DATABASE_ID || !process.env.NOTION_TOKEN) {
        return getFallbackTags();
      }
      
      const posts = await getBlogPosts();
      const allTags = posts.flatMap(post => post.tags);
      return Array.from(new Set(allTags));
    } catch (error) {
      console.error('Error fetching tags:', error);
      return getFallbackTags();
    }
  },
  ['all-tags'],
  {
    revalidate: 3600, // 1시간으로 연장 (30분 → 1시간)
    tags: ['notion-blog', 'blog-tags']
  }
); 