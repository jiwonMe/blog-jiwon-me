import { NotionRichText, NotionColor } from './types';

// 리치 텍스트에서 플레인 텍스트 추출
export function getPlainText(richText: NotionRichText[]): string {
  if (!Array.isArray(richText)) return '';
  
  return richText.map((text) => {
    if (text.type === 'equation') {
      return `$${text.equation?.expression || ''}$`;
    }
    return text.plain_text || '';
  }).join('');
}

// 날짜 문자열 추출
export function getDateString(date: any): string {
  return date?.start || '';
}

// 태그 배열 추출
export function getTags(multiSelect: any[]): string[] {
  if (!Array.isArray(multiSelect)) return [];
  return multiSelect.map((tag) => tag.name || '').filter(Boolean);
}

// 읽기 시간 계산
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes}분`;
}

// 색상 값 반환
export function getColor(color: string): NotionColor {
  return (color as NotionColor) || 'default';
}

// 멘션 콘텐츠 추출
export function getMentionContent(mention: any): string {
  if (!mention || !mention.type) {
    return '@mention';
  }

  switch (mention.type) {
    case 'user':
      return `@${mention.user?.name || mention.user?.id || 'User'}`;
    case 'page':
      return `[Page](notion://page/${mention.page?.id || ''})`;
    case 'database':
      return `[Database](notion://database/${mention.database?.id || ''})`;
    case 'date':
      if (mention.date) {
        const start = mention.date.start;
        const end = mention.date.end;
        return end ? `${start} → ${end}` : start;
      }
      return '[Date]';
    case 'link_preview':
      return `[${mention.link_preview?.url || ''}](${mention.link_preview?.url || ''})`;
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

// 리치 텍스트를 마크다운으로 변환 (어노테이션 포함)
export function richTextToMarkdownWithAnnotations(richTextArray: NotionRichText[]): string {
  if (!Array.isArray(richTextArray)) return '';

  return richTextArray.map(richText => {
    if (!richText || typeof richText !== 'object') return '';

    let text = '';
    
    // 텍스트 콘텐츠 추출
    if (richText.type === 'text') {
      text = richText.text?.content || '';
    } else if (richText.type === 'mention') {
      text = getMentionContent(richText.mention);
    } else if (richText.type === 'equation') {
      text = `$${richText.equation?.expression || ''}$`;
    } else {
      text = richText.plain_text || '';
    }

    // 어노테이션 적용
    const annotations = richText.annotations || {};
    
    if (annotations.bold) text = `**${text}**`;
    if (annotations.italic) text = `*${text}*`;
    if (annotations.strikethrough) text = `~~${text}~~`;
    if (annotations.underline) text = `<u>${text}</u>`;
    if (annotations.code) text = `\`${text}\``;
    
    // 색상 처리
    if (annotations.color && annotations.color !== 'default') {
      const colorClass = `notion-${annotations.color}`;
      text = `<span class="${colorClass}">${text}</span>`;
    }

    // 링크 처리
    if (richText.href || (richText.text && richText.text.link)) {
      const url = richText.href || richText.text?.link?.url;
      text = `[${text}](${url})`;
    }

    return text;
  }).join('');
}

// 콘텐츠에서 자동 요약 생성
export function generateExcerptFromContent(content: string, maxLength: number = 200): string {
  // 마크다운 포맷팅 제거하고 플레인 텍스트 추출
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // 헤더 제거
    .replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 제거
    .replace(/\*(.*?)\*/g, '$1') // 이탤릭 제거
    .replace(/`(.*?)`/g, '$1') // 인라인 코드 제거
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
    .replace(/\$\$([\s\S]*?)\$\$/g, '') // 블록 수식 제거
    .replace(/\$(.*?)\$/g, '') // 인라인 수식 제거
    .replace(/!\[.*?\]\(.*?\)/g, '') // 이미지 제거
    .replace(/\[.*?\]\(.*?\)/g, '') // 링크 제거
    .replace(/>\s+/g, '') // 인용문 제거
    .replace(/[-*+]\s+/g, '') // 리스트 마커 제거
    .replace(/\d+\.\s+/g, '') // 번호 리스트 마커 제거
    .replace(/\n+/g, ' ') // 줄바꿈을 공백으로 변경
    .trim();

  // maxLength로 자르고 필요시 말줄임표 추가
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // 마지막 완전한 단어 찾기
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
} 