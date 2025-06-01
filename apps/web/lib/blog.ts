import { notion, BLOG_DATABASE_ID, getPlainText, getDateString, getTags, calculateReadTime, getCoverImage } from './notion';
import { BlogPost, isPageObjectResponse } from '../types/blog';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { getFallbackBlogPosts, getFallbackBlogPost, getFallbackTags } from './fallback-data';

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

// Extract first image URL from content blocks
async function extractFirstImage(pageId: string): Promise<string | null> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    for (const block of response.results) {
      if ('type' in block && block.type === 'image') {
        const imageBlock = block as any;
        if (imageBlock.image.type === 'external') {
          return imageBlock.image.external.url;
        } else if (imageBlock.image.type === 'file') {
          return imageBlock.image.file.url;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting first image:', error);
    return null;
  }
}

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

// Convert Notion page to BlogPost
async function notionPageToBlogPost(page: PageObjectResponse, content: string, firstImageUrl?: string): Promise<BlogPost> {
  const title = getTitle(page);
  const slug = getSlug(page);
  const excerpt = getExcerpt(page);
  const date = getDate(page);
  const tags = getTagsFromPage(page);
  const published = getPublished(page);
  
  // Thumbnail priority: 1. Cover image, 2. First image in content, 3. Auto-generated
  let thumbnail = getCoverImage(page.cover);
  if (!thumbnail && firstImageUrl) {
    thumbnail = firstImageUrl;
  }
  if (!thumbnail) {
    thumbnail = await generateThumbnail(title, tags);
  }
  
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

// Fetch all published blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
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
}

// Fetch a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
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
}

// Get page content as markdown
export async function getPageContent(pageId: string): Promise<string> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    let content = '';
    
    for (const block of response.results) {
      content += await blockToMarkdown(block);
    }

    return content;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return '';
  }
}

// Convert Notion block to markdown
async function blockToMarkdown(block: any): Promise<string> {
  const { type } = block;
  
  switch (type) {
    case 'paragraph':
      return `${getPlainText(block.paragraph.rich_text)}\n\n`;
    
    case 'heading_1':
      return `# ${getPlainText(block.heading_1.rich_text)}\n\n`;
    
    case 'heading_2':
      return `## ${getPlainText(block.heading_2.rich_text)}\n\n`;
    
    case 'heading_3':
      return `### ${getPlainText(block.heading_3.rich_text)}\n\n`;
    
    case 'bulleted_list_item':
      return `- ${getPlainText(block.bulleted_list_item.rich_text)}\n`;
    
    case 'numbered_list_item':
      return `1. ${getPlainText(block.numbered_list_item.rich_text)}\n`;
    
    case 'code':
      const language = block.code.language || '';
      const code = getPlainText(block.code.rich_text);
      return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
    
    case 'quote':
      return `> ${getPlainText(block.quote.rich_text)}\n\n`;
    
    case 'divider':
      return '---\n\n';
    
    case 'image':
      const imageUrl = block.image.type === 'external' 
        ? block.image.external.url 
        : block.image.file.url;
      const caption = block.image.caption ? getPlainText(block.image.caption) : '';
      return `![${caption}](${imageUrl})\n\n`;
    
    default:
      // For unsupported blocks, try to extract text if available
      if (block[type] && block[type].rich_text) {
        return `${getPlainText(block[type].rich_text)}\n\n`;
      }
      return '';
  }
}

// Get all unique tags from published posts
export async function getAllTags(): Promise<string[]> {
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
} 