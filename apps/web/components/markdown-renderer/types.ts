import React from 'react';

// 마크다운 렌더러 Props
export interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Notion 색상 매핑 타입
export type NotionColorMapping = Record<string, string>;

// 컴포넌트 Props 타입들
export interface ToggleBlockProps {
  summary: string;
  children: React.ReactNode;
  color?: string;
}

export interface ToggleHeadingProps {
  level: string;
  children: React.ReactNode;
  content: string;
}

export interface CalloutBlockProps {
  icon: string;
  color: string;
  children: React.ReactNode;
}

export interface ColumnsLayoutProps {
  children: React.ReactNode;
}

export interface ColumnBlockProps {
  children: React.ReactNode;
}

export interface FileBlockProps {
  url: string;
  title: string;
}

export interface VideoBlockProps {
  url: string;
  title: string;
}

export interface AudioBlockProps {
  url: string;
  title: string;
}

export interface EmbedBlockProps {
  url: string;
  caption?: string;
}

export interface TemplateBlockProps {
  title: string;
  children: React.ReactNode;
}

export interface TableOfContentsBlockProps {
  color?: string;
}

// 헤딩 정보 타입
export interface HeadingInfo {
  id: string;
  text: string;
  level: number;
} 