'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ToggleBlockProps,
  ToggleHeadingProps,
  CalloutBlockProps,
  ColumnsLayoutProps,
  ColumnBlockProps,
  FileBlockProps,
  VideoBlockProps,
  AudioBlockProps,
  EmbedBlockProps,
  TemplateBlockProps,
  TableOfContentsBlockProps,
  HeadingInfo,
  NotionColorMapping
} from './types';

// Notion 색상 매핑
export const notionColors: NotionColorMapping = {
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
export function ToggleBlock({ summary, children, color }: ToggleBlockProps) {
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
export function ToggleHeading({ level, children, content }: ToggleHeadingProps) {
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
export function CalloutBlock({ icon, color, children }: CalloutBlockProps) {
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
export function ColumnsLayout({ children }: ColumnsLayoutProps) {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

export function ColumnBlock({ children }: ColumnBlockProps) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
}

// 파일 블록 컴포넌트
export function FileBlock({ url, title }: FileBlockProps) {
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
export function VideoBlock({ url, title }: VideoBlockProps) {
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
export function AudioBlock({ url, title }: AudioBlockProps) {
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
export function EmbedBlock({ url, caption }: EmbedBlockProps) {
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
export function TemplateBlock({ title, children }: TemplateBlockProps) {
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
export function TableOfContentsBlock({ color }: TableOfContentsBlockProps) {
  const [headings, setHeadings] = useState<HeadingInfo[]>([]);

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
export function BreadcrumbBlock() {
  return (
    <div className="my-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 font-wanted">
        <span className="text-base">🍞</span>
        <span>Breadcrumb Navigation</span>
      </div>
    </div>
  );
} 