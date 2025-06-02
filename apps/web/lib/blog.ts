import { 
  notion, 
  BLOG_DATABASE_ID, 
  getPlainText, 
  getDateString, 
  getTags, 
  calculateReadTime, 
  getCoverImage,
  getFileUrl,
  richTextToMarkdown,
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
  getSyncedBlockData
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

  return {
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

// Process nested children blocks
async function processChildren(blockId: string, indent: string = ''): Promise<string> {
  try {
    const response = await notion.blocks.children.list({
      block_id: blockId,
    });

    let content = '';
    for (const child of response.results) {
      const childContent = await blockToMarkdown(child, indent);
      content += childContent;
    }
    
    return content;
  } catch (error) {
    console.error('Error processing children blocks:', error);
    return '';
  }
}

// Convert Notion block to markdown with support for all block types
async function blockToMarkdown(block: any, indent: string = ''): Promise<string> {
  const { type } = block;
  
  switch (type) {
    case 'paragraph':
      return `${richTextToMarkdown(block.paragraph.rich_text)}\n\n`;
    
    case 'heading_1':
      return `# ${richTextToMarkdown(block.heading_1.rich_text)}\n\n`;
    
    case 'heading_2':
      return `## ${richTextToMarkdown(block.heading_2.rich_text)}\n\n`;
    
    case 'heading_3':
      return `### ${richTextToMarkdown(block.heading_3.rich_text)}\n\n`;
    
    case 'bulleted_list_item':
      let bulletContent = `${indent}- ${richTextToMarkdown(block.bulleted_list_item.rich_text)}\n`;
      if (block.has_children) {
        const childrenContent = await processChildren(block.id, indent + '  ');
        bulletContent += childrenContent;
      }
      return bulletContent;
    
    case 'numbered_list_item':
      let numberedContent = `${indent}1. ${richTextToMarkdown(block.numbered_list_item.rich_text)}\n`;
      if (block.has_children) {
        const childrenContent = await processChildren(block.id, indent + '   ');
        numberedContent += childrenContent;
      }
      return numberedContent;
    
    case 'to_do':
      const { text, checked } = getToDoData(block.to_do);
      const checkbox = checked ? '[x]' : '[ ]';
      let todoContent = `${indent}${checkbox} ${text}\n`;
      if (block.has_children) {
        const childrenContent = await processChildren(block.id, indent + '  ');
        todoContent += childrenContent;
      }
      return todoContent;
    
    case 'toggle':
      const { text: toggleText } = getToggleData(block.toggle);
      let toggleContent = `${indent}<details>\n${indent}<summary>${toggleText}</summary>\n\n`;
      if (block.has_children) {
        const childrenContent = await processChildren(block.id, indent);
        toggleContent += childrenContent;
      }
      toggleContent += `${indent}</details>\n\n`;
      return toggleContent;
    
    case 'code':
      const language = block.code.language || '';
      const code = richTextToMarkdown(block.code.rich_text);
      return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
    
    case 'quote':
      return `> ${richTextToMarkdown(block.quote.rich_text)}\n\n`;
    
    case 'callout':
      const { icon, text: calloutText } = getCalloutData(block.callout);
      const iconDisplay = icon ? `${icon} ` : '';
      return `> ${iconDisplay}${calloutText}\n\n`;
    
    case 'divider':
      return '---\n\n';
    
    case 'image':
      const imageUrl = optimizeImageUrl(getFileUrl(block.image) || '');
      const caption = block.image.caption ? richTextToMarkdown(block.image.caption) : '';
      return `![${caption}](${imageUrl})\n\n`;
    
    case 'video':
      const videoUrl = getFileUrl(block.video) || '';
      return `[Video](${videoUrl})\n\n`;
    
    case 'audio':
      const audioUrl = getFileUrl(block.audio) || '';
      return `[Audio](${audioUrl})\n\n`;
    
    case 'file':
      const fileUrl = getFileUrl(block.file) || '';
      const fileName = block.file.caption ? richTextToMarkdown(block.file.caption) : 'File';
      return `[${fileName}](${fileUrl})\n\n`;
    
    case 'pdf':
      const pdfUrl = getFileUrl(block.pdf) || '';
      return `[PDF](${pdfUrl})\n\n`;
    
    case 'bookmark':
      const { url: bookmarkUrl, caption: bookmarkCaption } = getBookmarkData(block.bookmark);
      return `[${bookmarkCaption || 'Bookmark'}](${bookmarkUrl})\n\n`;
    
    case 'link_preview':
      const { url: linkUrl } = getLinkPreviewData(block.link_preview);
      return `[Link Preview](${linkUrl})\n\n`;
    
    case 'embed':
      const embedUrl = getEmbedUrl(block.embed);
      return `[Embed](${embedUrl})\n\n`;
    
    case 'equation':
      // Block equation - wrap in $$ for LaTeX display mode
      return `$$${block.equation.expression}$$\n\n`;
    
    case 'table':
      const { tableWidth, hasColumnHeader } = getTableData(block.table);
      // For tables, we need to get the table rows separately
      try {
        const tableResponse = await notion.blocks.children.list({
          block_id: block.id,
        });
        
        let tableMarkdown = '';
        const rows = tableResponse.results.filter((row: any) => row.type === 'table_row');
        
                 if (rows.length > 0) {
           // Process each row
           rows.forEach((row: any, index: number) => {
             const cells = processCells(row.table_row.cells);
             
             // Ensure cells don't contain pipe characters that would break table formatting
             const safeCells = cells.map(cell => cell.replace(/\|/g, '\\|'));
             
             tableMarkdown += `| ${safeCells.join(' | ')} |\n`;
             
             // Add header separator after first row if it's a header
             if (index === 0 && hasColumnHeader) {
               const separator = safeCells.map(() => '---').join(' | ');
               tableMarkdown += `| ${separator} |\n`;
             }
           });
         }
        
        return `${tableMarkdown}\n`;
      } catch (error) {
        console.error('Error processing table:', error);
        return `[Table with ${tableWidth} columns]\n\n`;
      }
    
    case 'table_row':
      // Table rows are handled by the table block
      return '';
    
    case 'column_list':
      // Column lists contain columns as children
      let columnListContent = '\n';
      if (block.has_children) {
        columnListContent += await processChildren(block.id, indent);
      }
      return columnListContent + '\n';
    
    case 'column':
      // Columns contain other blocks as children
      let columnContent = `${indent}<!-- Column Start -->\n`;
      if (block.has_children) {
        columnContent += await processChildren(block.id, indent);
      }
      columnContent += `${indent}<!-- Column End -->\n`;
      return columnContent;
    
    case 'child_page':
      const pageTitle = richTextToMarkdown(block.child_page.title || []);
      return `[${pageTitle}](notion://page/${block.id})\n\n`;
    
    case 'child_database':
      const dbTitle = richTextToMarkdown(block.child_database.title || []);
      return `[Database: ${dbTitle}](notion://database/${block.id})\n\n`;
    
    case 'table_of_contents':
      return `[Table of Contents]\n\n`;
    
    case 'breadcrumb':
      return `[Breadcrumb]\n\n`;
    
    case 'link_to_page':
      const linkType = block.link_to_page.type;
      const linkId = block.link_to_page[linkType];
      return `[Link to ${linkType}](notion://${linkType}/${linkId})\n\n`;
    
    case 'synced_block':
      const { syncedFrom } = getSyncedBlockData(block.synced_block);
      if (syncedFrom) {
        return `${indent}[Synced from: ${syncedFrom}]\n\n`;
      } else {
        // Original synced block - process children
        let syncedContent = '';
        if (block.has_children) {
          syncedContent += await processChildren(block.id, indent);
        }
        return syncedContent;
      }
    
    case 'template':
      const templateText = richTextToMarkdown(block.template.rich_text || []);
      return `[Template: ${templateText}]\n\n`;
    
    case 'mention':
      const mentionContent = getMentionContent(block.mention);
      return `${indent}${mentionContent}`;
    
    case 'unsupported':
      return `${indent}[Unsupported block type]\n\n`;
    
    default:
      // For any other block types, try to extract text if available
      if (block[type] && block[type].rich_text) {
        return `${indent}${richTextToMarkdown(block[type].rich_text)}\n\n`;
      }
      console.warn(`Unsupported block type: ${type}`);
      return '';
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