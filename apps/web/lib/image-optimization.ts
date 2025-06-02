// 이미지 최적화 관련 유틸리티 함수들

// 이미지 URL에서 파일 확장자 추출
export function getImageExtension(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();
    return extension || 'jpg';
  } catch {
    return 'jpg';
  }
}

// 이미지 크기 추정 (대략적인 값)
export function estimateImageSize(url: string): { width: number; height: number } {
  // Notion 이미지의 경우 일반적인 크기 추정
  if (url.includes('notion.so') || url.includes('amazonaws.com')) {
    return { width: 1200, height: 630 }; // 일반적인 블로그 이미지 비율
  }
  
  // 기본값
  return { width: 800, height: 600 };
}

// 이미지 품질 설정
export const IMAGE_QUALITY_SETTINGS = {
  thumbnail: 75,
  medium: 85,
  high: 95,
} as const;

// 이미지 크기 설정
export const IMAGE_SIZES = {
  thumbnail: { width: 300, height: 200 },
  small: { width: 600, height: 400 },
  medium: { width: 1200, height: 800 },
  large: { width: 1920, height: 1280 },
} as const;

// 블러 데이터 URL 생성
export function generateBlurDataURL(width: number = 10, height: number = 6): string {
  const canvas = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(229,231,235);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(243,244,246);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`;
}

// 이미지 로딩 우선순위 결정
export function getImagePriority(index: number, isAboveFold: boolean = false): boolean {
  // 첫 번째 이미지이거나 above-the-fold에 있는 경우 우선순위 설정
  return index === 0 || isAboveFold;
}

// 이미지 sizes 속성 생성
export function generateImageSizes(context: 'thumbnail' | 'hero' | 'content' | 'grid'): string {
  switch (context) {
    case 'thumbnail':
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 300px';
    case 'hero':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px';
    case 'content':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px';
    case 'grid':
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px';
    default:
      return '100vw';
  }
}

// 이미지 캐시 키 생성 (Notion URL 정규화)
export function generateImageCacheKey(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // AWS S3 URL의 경우 경로만 사용하여 안정적인 캐시 키 생성
    if (urlObj.hostname.includes('amazonaws.com')) {
      return urlObj.pathname;
    }
    
    // 기타 URL의 경우 전체 URL 사용
    return url;
  } catch {
    return url;
  }
}

// 이미지 최적화 옵션
export interface ImageOptimizationOptions {
  quality?: keyof typeof IMAGE_QUALITY_SETTINGS;
  size?: keyof typeof IMAGE_SIZES;
  priority?: boolean;
  placeholder?: boolean;
  lazy?: boolean;
}

// 이미지 최적화 설정 생성
export function createImageConfig(
  url: string,
  options: ImageOptimizationOptions = {}
): {
  src: string;
  quality: number;
  priority: boolean;
  placeholder: 'blur' | 'empty';
  blurDataURL?: string;
  loading: 'lazy' | 'eager';
  sizes: string;
} {
  const {
    quality = 'medium',
    priority = false,
    placeholder = true,
    lazy = true,
  } = options;

  return {
    src: url,
    quality: IMAGE_QUALITY_SETTINGS[quality],
    priority,
    placeholder: placeholder ? 'blur' : 'empty',
    blurDataURL: placeholder ? generateBlurDataURL() : undefined,
    loading: lazy && !priority ? 'lazy' : 'eager',
    sizes: generateImageSizes('content'),
  };
} 