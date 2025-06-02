'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Components } from 'react-markdown';
import React, { useState } from 'react';

// KaTeX CSS 스타일 임포트
import 'katex/dist/katex.min.css';
// Highlight.js CSS 스타일 임포트
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Notion 색상 매핑
const notionColors = {
  'notion-gray': 'text-gray-500 dark:text-gray-400',
  'notion-gray_background': 'bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded',
  'notion-brown': 'text-amber-700 dark:text-amber-300',
  'notion-brown_background': 'bg-amber-100 dark:bg-amber-900/30 px-1 py-0.5 rounded',
  'notion-orange': 'text-orange-600 dark:text-orange-400',
  'notion-orange_background': 'bg-orange-100 dark:bg-orange-900/30 px-1 py-0.5 rounded',
  'notion-yellow': 'text-yellow-600 dark:text-yellow-400',
  'notion-yellow_background': 'bg-yellow-100 dark:bg-yellow-900/30 px-1 py-0.5 rounded',
  'notion-green': 'text-green-600 dark:text-green-400',
  'notion-green_background': 'bg-green-100 dark:bg-green-900/30 px-1 py-0.5 rounded',
  'notion-blue': 'text-blue-600 dark:text-blue-400',
  'notion-blue_background': 'bg-blue-100 dark:bg-blue-900/30 px-1 py-0.5 rounded',
  'notion-purple': 'text-purple-600 dark:text-purple-400',
  'notion-purple_background': 'bg-purple-100 dark:bg-purple-900/30 px-1 py-0.5 rounded',
  'notion-pink': 'text-pink-600 dark:text-pink-400',
  'notion-pink_background': 'bg-pink-100 dark:bg-pink-900/30 px-1 py-0.5 rounded',
  'notion-red': 'text-red-600 dark:text-red-400',
  'notion-red_background': 'bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded',
};

// Toggle 컴포넌트 (Notion의 toggle 블록용)
function ToggleBlock({ 
  summary, 
  children, 
  color 
}: { 
  summary: string; 
  children: React.ReactNode; 
  color?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const colorClass = color && color !== 'default' ? notionColors[`notion-${color}` as keyof typeof notionColors] : '';
  
  return (
    <div className="my-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left p-4 font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-wanted flex items-center justify-between ${colorClass}`}
      >
        <span>{summary}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>
          ▶
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

// Toggle 헤딩 컴포넌트
function ToggleHeading({ 
  level, 
  children, 
  content 
}: { 
  level: string; 
  children: React.ReactNode; 
  content: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const headingClasses = {
    '1': 'text-3xl font-bold mt-8 mb-4',
    '2': 'text-2xl font-semibold mt-6 mb-3',
    '3': 'text-xl font-semibold mt-5 mb-2',
  };
  
  const className = `${headingClasses[level as keyof typeof headingClasses]} text-gray-900 dark:text-gray-100 font-wanted cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 flex items-center`;
  
  const handleClick = () => setIsOpen(!isOpen);
  
  return (
    <div className="my-4">
      {level === '1' && (
        <h1 className={className} onClick={handleClick}>
          <span className={`mr-2 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>
            ▶
          </span>
          {content}
        </h1>
      )}
      {level === '2' && (
        <h2 className={className} onClick={handleClick}>
          <span className={`mr-2 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>
            ▶
          </span>
          {content}
        </h2>
      )}
      {level === '3' && (
        <h3 className={className} onClick={handleClick}>
          <span className={`mr-2 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>
            ▶
          </span>
          {content}
        </h3>
      )}
      {isOpen && (
        <div className="ml-6 mt-2">
          {children}
        </div>
      )}
    </div>
  );
}

// Callout 컴포넌트
function CalloutBlock({ 
  icon, 
  color, 
  children 
}: { 
  icon: string; 
  color: string; 
  children: React.ReactNode;
}) {
  const getCalloutTheme = (color: string) => {
    const themes = {
      'yellow': 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      'red': 'border-red-500 bg-red-50 dark:bg-red-900/20',
      'blue': 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      'green': 'border-green-500 bg-green-50 dark:bg-green-900/20',
      'orange': 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
      'purple': 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
      'pink': 'border-pink-500 bg-pink-50 dark:bg-pink-900/20',
      'gray': 'border-gray-500 bg-gray-50 dark:bg-gray-900/20',
      'brown': 'border-amber-500 bg-amber-50 dark:bg-amber-900/20',
      'default': 'border-gray-500 bg-gray-50 dark:bg-gray-900/20',
    };
    return themes[color as keyof typeof themes] || themes.default;
  };
  
  return (
    <div className={`my-4 p-4 border-l-4 rounded-r-lg ${getCalloutTheme(color)}`}>
      <div className="flex items-start space-x-3">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div className="flex-1 text-gray-700 dark:text-gray-300 font-wanted">
          {children}
        </div>
      </div>
    </div>
  );
}

// 컬럼 레이아웃 컴포넌트
function ColumnsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

function ColumnBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
}

// 파일 블록 컴포넌트
function FileBlock({ url, title }: { url: string; title: string }) {
  const getFileIcon = (title: string, url: string) => {
    if (title.toLowerCase().includes('pdf') || url.toLowerCase().includes('.pdf')) return '📄';
    if (title.toLowerCase().includes('video') || /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(url)) return '🎥';
    if (title.toLowerCase().includes('audio') || /\.(mp3|wav|flac|aac|ogg|m4a)$/i.test(url)) return '🎵';
    if (/\.(doc|docx)$/i.test(url)) return '📝';
    if (/\.(xls|xlsx)$/i.test(url)) return '📊';
    if (/\.(ppt|pptx)$/i.test(url)) return '📽️';
    if (/\.(zip|rar|7z|tar|gz)$/i.test(url)) return '🗜️';
    return '📎';
  };

  return (
    <div className="my-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 no-underline"
      >
        <span className="text-2xl">{getFileIcon(title, url)}</span>
        <div className="flex-1">
          <div className="font-semibold font-wanted">{title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{url}</div>
        </div>
        <span className="text-gray-400">↗</span>
      </a>
    </div>
  );
}

// 비디오 블록 컴포넌트
function VideoBlock({ url, title }: { url: string; title: string }) {
  return (
    <div className="my-6">
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <video 
          controls 
          className="w-full h-full"
          preload="metadata"
        >
          <source src={url} />
          <p className="p-4 text-center text-gray-500 dark:text-gray-400 font-wanted">
            Your browser does not support the video tag.
            <br />
            <a href={url} className="text-blue-600 dark:text-blue-400 underline">
              Download video: {title}
            </a>
          </p>
        </video>
      </div>
      {title && title !== 'Video' && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic font-wanted">
          {title}
        </p>
      )}
    </div>
  );
}

// 오디오 블록 컴포넌트
function AudioBlock({ url, title }: { url: string; title: string }) {
  return (
    <div className="my-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">🎵</span>
        <div className="font-semibold font-wanted">{title}</div>
      </div>
      <audio 
        controls 
        className="w-full"
        preload="metadata"
      >
        <source src={url} />
        <p className="text-gray-500 dark:text-gray-400 font-wanted">
          Your browser does not support the audio tag.
          <br />
          <a href={url} className="text-blue-600 dark:text-blue-400 underline">
            Download audio: {title}
          </a>
        </p>
      </audio>
    </div>
  );
}

// Embed 블록 컴포넌트
function EmbedBlock({ url, caption }: { url: string; caption?: string }) {
  return (
    <div className="my-6">
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <iframe
          src={url}
          className="w-full h-full border-0"
          allowFullScreen
          title={caption || 'Embedded content'}
        />
      </div>
      {caption && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic font-wanted">
          {caption}
        </p>
      )}
    </div>
  );
}

// Template 블록 컴포넌트
function TemplateBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="my-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/30">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-lg">📋</span>
        <span className="font-semibold text-gray-700 dark:text-gray-300 font-wanted">Template: {title}</span>
      </div>
      <div className="text-gray-600 dark:text-gray-400">
        {children}
      </div>
    </div>
  );
}

// Table of Contents 컴포넌트
function TableOfContentsBlock({ color }: { color?: string }) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

  React.useEffect(() => {
    // Extract headings from the current page
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const extractedHeadings = Array.from(headingElements).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      };
    });
    setHeadings(extractedHeadings);
  }, []);

  const colorClass = color && color !== 'default' ? `notion-${color}` : '';

  return (
    <div className={`my-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 ${colorClass}`}>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-lg">📋</span>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 font-wanted">목차</h3>
      </div>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-wanted`}
            style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

// Breadcrumb 컴포넌트
function BreadcrumbBlock() {
  return (
    <div className="my-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 font-wanted">
        <span className="text-base">🍞</span>
        <span>Breadcrumb Navigation</span>
      </div>
    </div>
  );
}

// HTML 요소들을 React 컴포넌트로 변환하는 전처리 함수
function preprocessContent(content: string): string {
  let processed = content;
  
  // Toggle 헤딩 처리
  processed = processed.replace(
    /:::toggle-heading\{level="(\d)"\}\s*(.*?)\s*:::/gs,
    (match, level, content) => {
      return `\n\n:::toggle-heading{level="${level}" content="${content.replace(/\n/g, ' ').trim()}"}\n${content}\n:::\n\n`;
    }
  );
  
  // Callout 처리
  processed = processed.replace(
    /:::callout\{icon="([^"]*)" color="([^"]*)"\}\s*([\s\S]*?)\s*:::/g,
    (match, icon, color, content) => {
      return `\n\n:::callout{icon="${icon}" color="${color}"}\n${content.trim()}\n:::\n\n`;
    }
  );
  
  // Toggle 처리
  processed = processed.replace(
    /:::toggle\{summary="([^"]*)"(?:\s+color="([^"]*)")?\}\s*([\s\S]*?)\s*:::/g,
    (match, summary, color, content) => {
      return `\n\n:::toggle{summary="${summary}"${color ? ` color="${color}"` : ''}}\n${content.trim()}\n:::\n\n`;
    }
  );
  
  // Columns 처리
  processed = processed.replace(
    /:::columns\s*([\s\S]*?)\s*:::/g,
    (match, content) => {
      return `\n\n:::columns\n${content.trim()}\n:::\n\n`;
    }
  );
  
  // Column 처리
  processed = processed.replace(
    /:::column\s*([\s\S]*?)\s*:::/g,
    (match, content) => {
      return `\n\n:::column\n${content.trim()}\n:::\n\n`;
    }
  );
  
  // Template 처리
  processed = processed.replace(
    /:::template\{title="([^"]*)"\}\s*([\s\S]*?)\s*:::/g,
    (match, title, content) => {
      return `\n\n:::template{title="${title}"}\n${content.trim()}\n:::\n\n`;
    }
  );
  
  // Table of Contents 처리
  processed = processed.replace(
    /:::table-of-contents(?:\s+\{\.notion-([^}]+)\})?\s*:::/g,
    (match, color) => {
      return `\n\n:::table-of-contents${color ? `{color="${color}"}` : ''}\n:::\n\n`;
    }
  );
  
  // Breadcrumb 처리
  processed = processed.replace(
    /:::breadcrumb\s*:::/g,
    () => {
      return `\n\n:::breadcrumb\n:::\n\n`;
    }
  );
  
  // Embed 처리
  processed = processed.replace(
    /:::embed\{url="([^"]*)"(?:\s+caption="([^"]*)")?\}\s*:::/g,
    (match, url, caption) => {
      return `\n\n:::embed{url="${url}"${caption ? ` caption="${caption}"` : ''}}\n:::\n\n`;
    }
  );
  
  // 기존 처리들
  processed = processed.replace(
    /:::video\{url="([^"]*)" title="([^"]*)"\}\s*:::/g,
    (match, url, title) => {
      return `\n\n:::video{url="${url}" title="${title}"}\n:::\n\n`;
    }
  );
  
  processed = processed.replace(
    /:::audio\{url="([^"]*)" title="([^"]*)"\}\s*:::/g,
    (match, url, title) => {
      return `\n\n:::audio{url="${url}" title="${title}"}\n:::\n\n`;
    }
  );
  
  processed = processed.replace(
    /:::file\{url="([^"]*)" title="([^"]*)"\}\s*:::/g,
    (match, url, title) => {
      return `\n\n:::file{url="${url}" title="${title}"}\n:::\n\n`;
    }
  );
  
  // underline 태그를 마크다운으로 변환
  processed = processed.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline;" class="notion-underline">$1</span>');
  
  return processed;
}

// 커스텀 컴포넌트 정의
const components: Components = {
  // 코드 블록 스타일링
  pre: ({ children, ...props }) => (
    <pre 
      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 border"
      {...props}
    >
      {children}
    </pre>
  ),
  
  // 인라인 코드 스타일링
  code: ({ children, className, ...props }) => {
    const isInline = !className;
    
    if (isInline) {
      return (
        <code 
          className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  
  // 헤딩 스타일링 (색상 지원)
  h1: ({ children, className, ...props }) => {
    const colorClass = className ? notionColors[className as keyof typeof notionColors] : '';
    const headingText = typeof children === 'string' ? children : String(children);
    const headingId = headingText.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    return (
      <h1 
        id={headingId}
        className={`text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100 font-wanted ${colorClass}`} 
        {...props}
      >
        {children}
      </h1>
    );
  },
  
  h2: ({ children, className, ...props }) => {
    const colorClass = className ? notionColors[className as keyof typeof notionColors] : '';
    const headingText = typeof children === 'string' ? children : String(children);
    const headingId = headingText.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    return (
      <h2 
        id={headingId}
        className={`text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100 font-wanted ${colorClass}`} 
        {...props}
      >
        {children}
      </h2>
    );
  },
  
  h3: ({ children, className, ...props }) => {
    const colorClass = className ? notionColors[className as keyof typeof notionColors] : '';
    const headingText = typeof children === 'string' ? children : String(children);
    const headingId = headingText.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    return (
      <h3 
        id={headingId}
        className={`text-xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100 font-wanted ${colorClass}`} 
        {...props}
      >
        {children}
      </h3>
    );
  },
  
  h4: ({ children, className, ...props }) => {
    const colorClass = className ? notionColors[className as keyof typeof notionColors] : '';
    return (
      <h4 className={`text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100 font-wanted ${colorClass}`} {...props}>
        {children}
      </h4>
    );
  },
  
  h5: ({ children, className, ...props }) => {
    const colorClass = className ? notionColors[className as keyof typeof notionColors] : '';
    return (
      <h5 className={`text-base font-semibold mt-3 mb-2 text-gray-900 dark:text-gray-100 font-wanted ${colorClass}`} {...props}>
        {children}
      </h5>
    );
  },
  
  h6: ({ children, className, ...props }) => {
    const colorClass = className ? notionColors[className as keyof typeof notionColors] : '';
    return (
      <h6 className={`text-sm font-semibold mt-3 mb-2 text-gray-900 dark:text-gray-100 font-wanted ${colorClass}`} {...props}>
        {children}
      </h6>
    );
  },
  
  // 단락 스타일링
  p: ({ children, ...props }) => {
    const childrenString = String(children);
    
    // Toggle 헤딩 처리
    if (childrenString.includes(':::toggle-heading')) {
      const toggleHeadingMatch = childrenString.match(/:::toggle-heading\{level="(\d)" content="([^"]+)"\}\s*([\s\S]*?)\s*:::/);
      if (toggleHeadingMatch) {
        const [, level, content, innerContent] = toggleHeadingMatch;
        return (
          <ToggleHeading level={level || '1'} content={content || ''}>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{innerContent || ''}</ReactMarkdown>
            </div>
          </ToggleHeading>
        );
      }
    }
    
    // Callout 처리
    if (childrenString.includes(':::callout')) {
      const calloutMatch = childrenString.match(/:::callout\{icon="([^"]*)" color="([^"]*)"\}\s*([\s\S]*?)\s*:::/);
      if (calloutMatch) {
        const [, icon, color, content] = calloutMatch;
        return (
          <CalloutBlock icon={icon || '💡'} color={color || 'default'}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              components={{
                p: ({ children }) => <span>{children}</span>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
              }}
            >
              {content || ''}
            </ReactMarkdown>
          </CalloutBlock>
        );
      }
    }
    
    // Toggle 블록 처리
    if (childrenString.includes(':::toggle')) {
      const toggleMatch = childrenString.match(/:::toggle\{summary="([^"]+)"(?:\s+color="([^"]*)")?\}\s*([\s\S]*?)\s*:::/);
      if (toggleMatch) {
        const [, summary, color, content] = toggleMatch;
        return (
          <ToggleBlock summary={summary || ''} color={color}>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{content || ''}</ReactMarkdown>
            </div>
          </ToggleBlock>
        );
      }
    }
    
         // Columns 처리
     if (childrenString.includes(':::columns')) {
       const columnsMatch = childrenString.match(/:::columns\s*([\s\S]*?)\s*:::/);
       if (columnsMatch) {
         const [, content] = columnsMatch;
         const columns = (content || '').split(/:::column\s*([\s\S]*?)\s*:::/g).filter(Boolean);
         return (
           <ColumnsLayout>
             {columns.map((columnContent, index) => (
               <ColumnBlock key={index}>
                 <ReactMarkdown>{columnContent}</ReactMarkdown>
               </ColumnBlock>
             ))}
           </ColumnsLayout>
         );
       }
     }
    
    // Template 처리
    if (childrenString.includes(':::template')) {
      const templateMatch = childrenString.match(/:::template\{title="([^"]*)"\}\s*([\s\S]*?)\s*:::/);
      if (templateMatch) {
        const [, title, content] = templateMatch;
        return (
          <TemplateBlock title={title || ''}>
            <ReactMarkdown>{content || ''}</ReactMarkdown>
          </TemplateBlock>
        );
      }
    }
    
    // Embed 처리
    if (childrenString.includes(':::embed')) {
      const embedMatch = childrenString.match(/:::embed\{url="([^"]*)"(?:\s+caption="([^"]*)")?\}\s*:::/);
      if (embedMatch) {
        const [, url, caption] = embedMatch;
        return <EmbedBlock url={url || ''} caption={caption} />;
      }
    }
    
    // 비디오 블록 처리
    if (childrenString.includes(':::video')) {
      const videoMatch = childrenString.match(/:::video\{url="([^"]+)"\s+title="([^"]+)"\}\s*:::/);
      if (videoMatch) {
        const [, url, title] = videoMatch;
        return <VideoBlock url={url || ''} title={title || 'Video'} />;
      }
    }
    
    // 오디오 블록 처리
    if (childrenString.includes(':::audio')) {
      const audioMatch = childrenString.match(/:::audio\{url="([^"]+)"\s+title="([^"]+)"\}\s*:::/);
      if (audioMatch) {
        const [, url, title] = audioMatch;
        return <AudioBlock url={url || ''} title={title || 'Audio'} />;
      }
    }
    
    // 파일 블록 처리
    if (childrenString.includes(':::file')) {
      const fileMatch = childrenString.match(/:::file\{url="([^"]+)"\s+title="([^"]+)"\}\s*:::/);
      if (fileMatch) {
        const [, url, title] = fileMatch;
        return <FileBlock url={url || ''} title={title || 'File'} />;
      }
    }
    
    // Table of Contents 처리
    if (childrenString.includes(':::table-of-contents')) {
      const tocMatch = childrenString.match(/:::table-of-contents(?:\{color="([^"]+)"\})?\s*:::/);
      if (tocMatch) {
        const [, color] = tocMatch;
        return <TableOfContentsBlock color={color} />;
      }
    }
    
    // Breadcrumb 처리
    if (childrenString.includes(':::breadcrumb')) {
      return <BreadcrumbBlock />;
    }
    
    return (
      <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300 font-wanted" {...props}>
        {children}
      </p>
    );
  },
  
  // 리스트 스타일링 (색상 지원)
  ul: ({ children, className, ...props }) => {
    const colorClass = className ? notionColors[className as keyof typeof notionColors] : '';
    return (
      <ul className={`list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300 font-wanted ${colorClass}`} {...props}>
        {children}
      </ul>
    );
  },
  
  ol: ({ children, className, ...props }) => {
    const colorClass = className ? notionColors[className as keyof typeof notionColors] : '';
    return (
      <ol className={`list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300 font-wanted ${colorClass}`} {...props}>
        {children}
      </ol>
    );
  },
  
  li: ({ children, className, ...props }) => {
    const colorClass = className ? notionColors[className as keyof typeof notionColors] : '';
    return (
      <li className={`ml-4 font-wanted ${colorClass}`} {...props}>
        {children}
      </li>
    );
  },
  
  // 인용문 스타일링 (Notion의 quote와 callout 지원)
  blockquote: ({ children, className, ...props }) => {
    const childrenString = String(children);
    const colorClass = className ? notionColors[className as keyof typeof notionColors] : '';
    
    // Callout 스타일 감지 (이모지로 시작하는 경우)
    const emojiMatch = childrenString.match(/^([^\w\s])\s+(.+)/s);
    if (emojiMatch) {
      const emoji = emojiMatch[1] || '';
      const text = emojiMatch[2] || '';
      
      // 이모지에 따른 색상 테마 결정
      const getCalloutTheme = (emoji: string) => {
        if (['💡', '⚡', '✨'].includes(emoji)) return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
        if (['⚠️', '🚨', '❗'].includes(emoji)) return 'border-red-500 bg-red-50 dark:bg-red-900/20';
        if (['ℹ️', '📝', '📋'].includes(emoji)) return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
        if (['✅', '✔️', '🎉'].includes(emoji)) return 'border-green-500 bg-green-50 dark:bg-green-900/20';
        if (['🔥', '🚀', '⭐'].includes(emoji)) return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
      };
      
      return (
        <div className={`my-4 p-4 border-l-4 rounded-r-lg ${getCalloutTheme(emoji)}`}>
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">{emoji}</span>
            <div className={`flex-1 text-gray-700 dark:text-gray-300 font-wanted ${colorClass}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                components={{
                  p: ({ children }) => <span>{children}</span>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                }}
              >
                {text || ''}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <blockquote 
        className={`border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300 font-wanted ${colorClass}`}
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  
  // 링크 스타일링
  a: ({ children, href, ...props }) => (
    <a 
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  
  // 이미지 스타일링 (Notion 이미지 지원)
  img: ({ src, alt, ...props }) => (
    <div className="my-6">
      <img 
        src={src}
        alt={alt || ''}
        className="max-w-full h-auto rounded-lg shadow-md mx-auto"
        loading="lazy"
        {...props}
      />
      {alt && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic font-wanted">
          {alt}
        </p>
      )}
    </div>
  ),
  
  // 테이블 스타일링
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="min-w-full border-collapse bg-white dark:bg-gray-900 table-auto" {...props}>
        {children}
      </table>
    </div>
  ),
  
  thead: ({ children, ...props }) => (
    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" {...props}>
      {children}
    </thead>
  ),
  
  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700" {...props}>
      {children}
    </tbody>
  ),
  
  tr: ({ children, ...props }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" {...props}>
      {children}
    </tr>
  ),
  
  th: ({ children, ...props }) => {
    // Handle empty header cells properly
    const cellContent = children === ' ' || children === '' ? '\u00A0' : children;
    
          return (
        <th 
          className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 font-wanted border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-w-[120px]"
          {...props}
        >
          {cellContent}
        </th>
      );
  },
  
  td: ({ children, ...props }) => {
    // Handle empty cells properly
    const cellContent = children === ' ' || children === '' ? '\u00A0' : children;
    
          return (
        <td 
          className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-wanted border-r border-gray-200 dark:border-gray-700 last:border-r-0 whitespace-pre-wrap min-w-[120px] align-top"
          {...props}
        >
          {cellContent}
        </td>
      );
  },
  
  // 수평선 스타일링
  hr: ({ ...props }) => (
    <hr className="my-8 border-gray-300 dark:border-gray-600" {...props} />
  ),
  
  // 강조 텍스트
  strong: ({ children, ...props }) => (
    <strong className="font-bold text-gray-900 dark:text-gray-100 font-wanted" {...props}>
      {children}
    </strong>
  ),
  
  em: ({ children, ...props }) => (
    <em className="italic font-wanted" {...props}>
      {children}
    </em>
  ),
  
  // 취소선 (GFM 지원)
  del: ({ children, ...props }) => (
    <del className="line-through text-gray-500 dark:text-gray-400 font-wanted" {...props}>
      {children}
    </del>
  ),
  
  // 체크박스 리스트 아이템 처리 (GFM 지원)
  input: ({ type, checked, disabled, ...props }) => {
    if (type === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="mr-2 accent-blue-600"
          readOnly
          {...props}
        />
      );
    }
    return <input type={type} {...props} />;
  },
  
  // span 태그 처리 (underline, 색상 등)
  span: ({ children, style, className, ...props }) => {
    // Notion 색상 클래스 확인
    const notionColorClass = className && Object.keys(notionColors).includes(className) 
      ? notionColors[className as keyof typeof notionColors] 
      : '';
    
    // 인라인 스타일에서 text-decoration 확인
    const textDecoration = style?.textDecoration;
    const hasUnderline = (typeof textDecoration === 'string' && textDecoration.includes('underline')) ||
                        (className && className.includes('notion-underline'));
    
    if (hasUnderline) {
      return (
        <span 
          className={`underline decoration-2 underline-offset-2 font-wanted ${notionColorClass} ${className || ''}`}
          style={style}
          {...props}
        >
          {children}
        </span>
      );
    }
    
    return (
      <span 
        style={style} 
        className={`font-wanted ${notionColorClass} ${className || ''}`} 
        {...props}
      >
        {children}
      </span>
    );
  },
};

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const processedContent = preprocessContent(content);
  
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
} 