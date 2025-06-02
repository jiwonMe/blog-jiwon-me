import { notion } from '../notion/client';
import { 
  getAllBlockChildren, 
  richTextToMarkdownWithAnnotations,
  getFileUrl,
  optimizeImageUrl,
  getIconData
} from '../notion';
import { NotionBlock } from '../notion/types';
import { handleBlogError } from './utils';

// 페이지 콘텐츠를 마크다운으로 변환
export async function getPageContent(pageId: string): Promise<string> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    let content = '';
    
    for (const block of response.results) {
      try {
        content += await blockToMarkdown(block as NotionBlock);
      } catch (blockError) {
        handleBlogError(blockError, `processing block ${block.id}`);
        const blockType = 'type' in block ? block.type : 'unknown';
        content += `[Error processing block: ${blockType}]\n\n`;
      }
    }

    return content;
  } catch (error) {
    handleBlogError(error, 'fetching page content');
    return '';
  }
}

// 첫 번째 이미지 URL 추출
export async function extractFirstImage(pageId: string): Promise<string | null> {
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
    handleBlogError(error, 'extracting first image');
    return null;
  }
}

// 중첩된 자식 블록 처리 (페이지네이션 지원)
async function processChildren(blockId: string, indent: string = ''): Promise<string> {
  try {
    const children = await getAllBlockChildren(blockId);

    let content = '';
    for (const child of children) {
      const childContent = await blockToMarkdown(child, indent);
      content += childContent;
    }
    
    return content;
  } catch (error) {
    handleBlogError(error, 'processing children blocks');
    return '';
  }
}

// Notion 블록을 마크다운으로 변환
async function blockToMarkdown(block: NotionBlock, indent: string = ''): Promise<string> {
  if (!block || !block.type) {
    return '';
  }

  const { type, has_children } = block;
  const blockData = block[type] || {};
  
  // 개발 환경에서 디버그 로깅
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
        return await processTable(block);
      
      case 'table_row':
        // 테이블 행은 부모 테이블 블록에서 처리됨
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
          // 원본 동기화 블록 - 자식 처리
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
      
      default:
        // 다른 블록 타입들에 대한 기본 처리
        if (blockData.rich_text) {
          const text = richTextToMarkdownWithAnnotations(blockData.rich_text);
          const color = blockData.color !== 'default' ? ` {.notion-${blockData.color}}` : '';
          return `${text}${color}\n\n`;
        }
        
        // 개발 환경에서 알 수 없는 블록 타입 로깅
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
    handleBlogError(error, `processing block type ${type}`);
    return `[⚠️ Error processing block: ${type}]\n\n`;
  }
}

// 테이블 처리 함수
async function processTable(block: NotionBlock): Promise<string> {
  const blockData = block.table || {};
  const tableWidth = blockData.table_width || 0;
  const hasColumnHeader = blockData.has_column_header || false;
  const hasRowHeader = blockData.has_row_header || false;
  
  try {
    const allChildren = await getAllBlockChildren(block.id);
    
    let tableMarkdown = '';
    const rows = allChildren.filter((row: any) => row.type === 'table_row');
    
    // 개발 환경에서 테이블 처리 디버깅
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
        const cells: string[] = [];
        
        const actualCellCount = row.table_row?.cells?.length || tableWidth;
        const cellCount = Math.max(actualCellCount, tableWidth);
        
        for (let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
          try {
            const cellData = row.table_row?.cells?.[cellIndex];
            if (cellData && Array.isArray(cellData)) {
              const cellContent = richTextToMarkdownWithAnnotations(cellData);
              let safeCellContent = (cellContent || '').replace(/\|/g, '\\|').trim();
              
              if (!safeCellContent) {
                safeCellContent = ' ';
              }
              
              cells.push(safeCellContent);
            } else {
              cells.push(' ');
            }
          } catch (cellError) {
            console.warn(`Error processing table cell [${rowIndex}][${cellIndex}]:`, cellError);
            cells.push(' ');
          }
        }
        
        tableMarkdown += `| ${cells.join(' | ')} |\n`;
        
        // 헤더 구분선 추가
        if (rowIndex === 0 && hasColumnHeader) {
          const separators = cells.map((_: string, cellIndex: number) => {
            if (cellIndex === 0 && hasRowHeader) {
              return ':---';
            }
            return '---';
          });
          tableMarkdown += `| ${separators.join(' | ')} |\n`;
        }
      });
    } else {
      // 빈 테이블 폴백
      const emptyCells = Array(tableWidth).fill(' ');
      tableMarkdown = `| ${emptyCells.join(' | ')} |\n`;
      if (hasColumnHeader) {
        const separators = Array(tableWidth).fill('---');
        tableMarkdown += `| ${separators.join(' | ')} |\n`;
      }
    }
    
    return `\n${tableMarkdown}\n`;
  } catch (error) {
    handleBlogError(error, 'processing table');
    return `\n**[Table with ${tableWidth} columns${hasColumnHeader ? ' (with headers)' : ''}${hasRowHeader ? ' (with row headers)' : ''}]**\n\n`;
  }
} 