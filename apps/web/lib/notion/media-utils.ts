// 커버 이미지 URL 추출
export function getCoverImage(cover: any): string | null {
  if (!cover) return null;
  
  if (cover.type === 'external') {
    return cover.external.url;
  } else if (cover.type === 'file') {
    return cover.file.url;
  }
  
  return null;
}

// 파일 URL 추출
export function getFileUrl(file: any): string | null {
  if (!file) return null;
  
  if (file.type === 'external') {
    return file.external.url;
  } else if (file.type === 'file') {
    return file.file.url;
  }
  
  return null;
}

// 이미지 URL 최적화 (Next.js용)
export function optimizeImageUrl(url: string): string {
  if (!url) return url;
  
  // Notion 파일 URL의 경우 CORS 문제를 피하기 위해 API 프록시 사용
  if (url.includes('notion.so') || url.includes('amazonaws.com')) {
    // URL을 정규화하여 캐시 효율성 향상
    try {
      const urlObj = new URL(url);
      
      // AWS S3 URL의 경우 토큰 파라미터들을 제거하여 안정적인 캐시 키 생성
      if (urlObj.hostname.includes('amazonaws.com')) {
        // 필수 파라미터만 유지하고 나머지는 제거
        const essentialParams = ['X-Amz-Algorithm', 'X-Amz-Credential', 'X-Amz-Date', 'X-Amz-Expires'];
        const newSearchParams = new URLSearchParams();
        
        essentialParams.forEach(param => {
          const value = urlObj.searchParams.get(param);
          if (value) {
            newSearchParams.set(param, value);
          }
        });
        
        // 정규화된 URL 생성
        const normalizedUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}?${newSearchParams.toString()}`;
        return `/api/image-proxy?url=${encodeURIComponent(normalizedUrl)}`;
      }
    } catch (error) {
      console.warn('Failed to normalize image URL:', error);
    }
    
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  
  return url;
}

// 아이콘 데이터 추출
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

// 임베드 URL 추출
export function getEmbedUrl(embed: any): string {
  return embed?.url || '';
}

// 북마크 데이터 추출
export function getBookmarkData(bookmark: any): { url: string; caption: string } {
  return {
    url: bookmark?.url || '',
    caption: bookmark?.caption ? bookmark.caption.map((c: any) => c.plain_text).join('') : ''
  };
}

// 링크 프리뷰 데이터 추출
export function getLinkPreviewData(linkPreview: any): { url: string } {
  return {
    url: linkPreview?.url || ''
  };
}

// 태그 기반 색상 생성 (썸네일용)
export function getColorFromTag(tag: string): string {
  const colors: Record<string, string> = {
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
  
  return colors[tag] || '4F46E5'; // 기본 보라색
}

// 자동 썸네일 생성
export async function generateThumbnail(title: string, tags: string[]): Promise<string> {
  const encodedTitle = encodeURIComponent(title.slice(0, 50));
  const primaryTag = tags[0] || 'Blog';
  const backgroundColor = getColorFromTag(primaryTag);
  
  return `https://via.placeholder.com/1200x630/${backgroundColor}/FFFFFF?text=${encodedTitle}`;
} 