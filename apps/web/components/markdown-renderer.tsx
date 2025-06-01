'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { Components } from 'react-markdown';

// KaTeX CSS 스타일 임포트
import 'katex/dist/katex.min.css';
// Highlight.js CSS 스타일 임포트
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
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
  
  // 헤딩 스타일링
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100 font-wanted" {...props}>
      {children}
    </h1>
  ),
  
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100 font-wanted" {...props}>
      {children}
    </h2>
  ),
  
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100 font-wanted" {...props}>
      {children}
    </h3>
  ),
  
  // 단락 스타일링
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300 font-wanted" {...props}>
      {children}
    </p>
  ),
  
  // 리스트 스타일링
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300 font-wanted" {...props}>
      {children}
    </ul>
  ),
  
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300 font-wanted" {...props}>
      {children}
    </ol>
  ),
  
  li: ({ children, ...props }) => (
    <li className="ml-4 font-wanted" {...props}>
      {children}
    </li>
  ),
  
  // 인용문 스타일링
  blockquote: ({ children, ...props }) => (
    <blockquote 
      className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300 font-wanted"
      {...props}
    >
      {children}
    </blockquote>
  ),
  
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
  
  // 테이블 스타일링
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
        {children}
      </table>
    </div>
  ),
  
  th: ({ children, ...props }) => (
    <th 
      className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold font-wanted"
      {...props}
    >
      {children}
    </th>
  ),
  
  td: ({ children, ...props }) => (
    <td 
      className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-wanted"
      {...props}
    >
      {children}
    </td>
  ),
  
  // 수평선 스타일링
  hr: ({ ...props }) => (
    <hr className="my-8 border-gray-300 dark:border-gray-600" {...props} />
  ),
};

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 