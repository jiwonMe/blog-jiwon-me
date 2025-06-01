'use client';

import { useEffect } from 'react';

export function FontLoader() {
  useEffect(() => {
    // 폰트 CSS를 동적으로 로드
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css';
    link.crossOrigin = 'anonymous';
    
    // preconnect 링크도 추가
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://cdn.jsdelivr.net';
    preconnect.crossOrigin = 'anonymous';
    
    document.head.appendChild(preconnect);
    document.head.appendChild(link);
    
    return () => {
      // 컴포넌트 언마운트 시 정리
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.head.contains(preconnect)) {
        document.head.removeChild(preconnect);
      }
    };
  }, []);

  return null;
} 