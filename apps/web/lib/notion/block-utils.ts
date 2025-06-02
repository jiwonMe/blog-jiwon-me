import { notion } from './client';
import { NotionBlock, BlockProcessingResult } from './types';

// 페이지네이션을 지원하는 블록 자식 요소 가져오기
export async function getAllBlockChildren(blockId: string): Promise<NotionBlock[]> {
  let allChildren: NotionBlock[] = [];
  let hasMore = true;
  let nextCursor: string | undefined;

  while (hasMore) {
    try {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: nextCursor,
        page_size: 100, // Notion API 최대값
      });

      allChildren = allChildren.concat(response.results as NotionBlock[]);
      hasMore = response.has_more;
      nextCursor = response.next_cursor || undefined;
    } catch (error) {
      console.error('Error fetching block children:', error);
      break;
    }
  }

  return allChildren;
}

// 테이블 셀 처리
export function processCells(cells: any[][]): string[] {
  if (!Array.isArray(cells)) return [];
  return cells.map(cell => {
    if (Array.isArray(cell)) {
      return cell.map(c => c.plain_text || '').join('');
    }
    return '';
  });
}

// 콜아웃 데이터 추출
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
    color: callout?.color || 'default',
    text: callout?.rich_text ? callout.rich_text.map((t: any) => t.plain_text).join('') : ''
  };
}

// 토글 데이터 추출
export function getToggleData(toggle: any): { text: string; color: string } {
  return {
    text: toggle?.rich_text ? toggle.rich_text.map((t: any) => t.plain_text).join('') : '',
    color: toggle?.color || 'default'
  };
}

// 할 일 데이터 추출
export function getToDoData(toDo: any): { text: string; checked: boolean; color: string } {
  return {
    text: toDo?.rich_text ? toDo.rich_text.map((t: any) => t.plain_text).join('') : '',
    checked: toDo?.checked || false,
    color: toDo?.color || 'default'
  };
}

// 테이블 데이터 추출
export function getTableData(table: any): { tableWidth: number; hasColumnHeader: boolean; hasRowHeader: boolean } {
  return {
    tableWidth: table?.table_width || 0,
    hasColumnHeader: table?.has_column_header || false,
    hasRowHeader: table?.has_row_header || false
  };
}

// 동기화된 블록 데이터 추출
export function getSyncedBlockData(syncedBlock: any): { syncedFrom: string | null; children: any[] } {
  return {
    syncedFrom: syncedBlock?.synced_from?.block_id || null,
    children: syncedBlock?.children || []
  };
}

// 블록 타입별 데이터 추출
export function getBlockTypeData(block: NotionBlock): any {
  if (!block || !block.type) {
    return null;
  }

  const blockType = block.type;
  const blockData = block[blockType] || {};

  // 공통 속성
  const commonData = {
    id: block.id,
    type: blockType,
    created_time: block.created_time,
    last_edited_time: block.last_edited_time,
    archived: block.archived,
    has_children: block.has_children,
    parent: block.parent,
  };

  // 타입별 특정 데이터
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
        type: blockData.type,
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

    case 'synced_block':
      return {
        ...commonData,
        synced_from: blockData.synced_from,
      };

    default:
      return {
        ...commonData,
        ...blockData,
      };
  }
} 