// 클라이언트 및 설정
export { 
  notion, 
  BLOG_DATABASE_ID, 
  validateNotionConfig, 
  isNotionError, 
  formatNotionError 
} from './notion/client';

// 타입 정의
export type { 
  NotionBlock, 
  NotionRichText, 
  NotionPageProperties, 
  NotionColor, 
  BlockProcessingResult, 
  CacheConfig 
} from './notion/types';

export { 
  isPageObjectResponse, 
  isNotionRichText 
} from './notion/types';

// 텍스트 처리 유틸리티
export {
  getPlainText,
  getDateString,
  getTags,
  calculateReadTime,
  getColor,
  getMentionContent,
  richTextToMarkdownWithAnnotations,
  generateExcerptFromContent
} from './notion/text-utils';

// 미디어 및 파일 처리 유틸리티
export {
  getCoverImage,
  getFileUrl,
  optimizeImageUrl,
  getIconData,
  getEmbedUrl,
  getBookmarkData,
  getLinkPreviewData,
  getColorFromTag,
  generateThumbnail
} from './notion/media-utils';

// 블록 처리 유틸리티
export {
  getAllBlockChildren,
  processCells,
  getCalloutData,
  getToggleData,
  getToDoData,
  getTableData,
  getSyncedBlockData,
  getBlockTypeData
} from './notion/block-utils';

// 레거시 호환성을 위한 기본 함수들 (deprecated)
// 이전 코드와의 호환성을 위해 유지하되, 새 코드에서는 위의 명시적 import 사용 권장

// 레거시 호환성을 위한 함수
import { richTextToMarkdownWithAnnotations } from './notion/text-utils';

/**
 * @deprecated Use richTextToMarkdownWithAnnotations instead
 */
export function richTextToMarkdown(richText: any[]): string {
  return richTextToMarkdownWithAnnotations(richText);
} 