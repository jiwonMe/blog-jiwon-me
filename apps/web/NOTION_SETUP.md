# Notion Blog Integration Setup

This guide will help you set up Notion as a CMS for your blog.

## Prerequisites

1. A Notion account
2. A Notion database for blog posts

## Step 1: Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Blog CMS")
4. Select the workspace where your blog database is located
5. Click "Submit"
6. Copy the "Internal Integration Token" - this will be your `NOTION_TOKEN`

## Step 2: Create a Blog Database

Create a new database in Notion with the following properties:

| Property Name | Property Type | Description |
|---------------|---------------|-------------|
| Title | Title | The blog post title |
| Slug | Rich Text | URL slug for the post |
| Excerpt | Rich Text | Short description/excerpt |
| Date | Date | Publication date |
| Tags | Multi-select | Post tags/categories |
| Published | Checkbox | Whether the post is published |

### Optional Properties:
- Cover: File & Media (for cover images - highly recommended for thumbnails)
- Author: Person (if you have multiple authors)

## Step 3: Share Database with Integration

1. Open your blog database in Notion
2. Click the "..." menu in the top right
3. Click "Add connections"
4. Select your integration
5. Click "Confirm"

## Step 4: Get Database ID

1. Open your blog database in Notion
2. Copy the URL - it will look like:
   `https://www.notion.so/workspace/DATABASE_ID?v=VIEW_ID`
3. The `DATABASE_ID` is the long string between the last `/` and the `?`
4. This will be your `NOTION_BLOG_DATABASE_ID`

## Step 5: Set Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```env
NOTION_TOKEN=your_integration_token_here
NOTION_BLOG_DATABASE_ID=your_database_id_here
```

## Step 6: Create Your First Blog Post

1. Add a new page to your blog database
2. Fill in all the required properties:
   - Title: Your blog post title
   - Slug: URL-friendly version (e.g., "my-first-post")
   - Excerpt: Brief description
   - Date: Publication date
   - Tags: Add relevant tags
   - Published: Check this box to make it visible
3. Write your content using Notion's rich text editor

## Supported Content Types

The integration supports the following Notion block types:

- **Text blocks**: Paragraph, headings (H1, H2, H3)
- **Lists**: Bulleted and numbered lists
- **Code blocks**: With syntax highlighting
- **Quotes**: Block quotes
- **Images**: Both uploaded and external images
- **Dividers**: Horizontal rules

## Automatic Thumbnail Generation

The blog automatically generates thumbnails for your posts using the following priority:

1. **Cover Image**: If you set a cover image on your Notion page, it will be used as the thumbnail
2. **First Image**: If no cover image is set, the first image in your post content will be used
3. **Auto-Generated**: If no images are available, a thumbnail will be automatically generated based on:
   - Post title
   - Primary tag (determines color scheme)
   - Consistent branding colors for different technologies

### Thumbnail Best Practices:

- **Add cover images** to your Notion pages for the best visual appeal
- **Use high-quality images** (recommended: 1200x630 pixels for optimal display)
- **Include images in your content** - the first image will be used as fallback
- **Choose descriptive tags** - they influence the auto-generated thumbnail colors

## Content Writing Tips

1. **Use headings** to structure your content (H1, H2, H3)
2. **Add code blocks** with language specification for syntax highlighting
3. **Include images** by uploading or linking external images
4. **Use quotes** for important callouts
5. **Create lists** for better readability

## Troubleshooting

### Posts not showing up?
- Check that the `Published` checkbox is checked
- Verify your environment variables are set correctly
- Make sure the integration has access to the database

### Content not rendering correctly?
- Ensure you're using supported block types
- Check the browser console for any errors
- Verify the Notion API token has the correct permissions

### Database connection issues?
- Confirm the database ID is correct
- Make sure the integration is connected to the database
- Check that the database properties match the expected schema

## Example Database Structure

Here's an example of how your Notion database should look:

| Title | Slug | Excerpt | Date | Tags | Published |
|-------|------|---------|------|------|-----------|
| Getting Started with Next.js | getting-started-nextjs | Learn how to build modern web apps | 2024-01-15 | Next.js, React | ✅ |
| TypeScript Best Practices | typescript-best-practices | Essential tips for TypeScript development | 2024-01-10 | TypeScript, JavaScript | ✅ |

## Next Steps

Once you have your Notion database set up and connected:

1. Create some test blog posts
2. Run your development server: `pnpm dev`
3. Visit `/blog` to see your posts
4. Click on individual posts to view the full content

Your blog is now powered by Notion! You can write and publish posts directly from Notion, and they'll automatically appear on your website. 