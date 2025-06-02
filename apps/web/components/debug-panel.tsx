'use client';

import { useState } from 'react';

interface DebugPanelProps {
  data: any;
  title?: string;
  className?: string;
}

export function DebugPanel({ data, title = "Debug Info", className = "" }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw'>('formatted');

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const formatJson = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      return String(obj);
    }
  };

  const renderValue = (value: any, depth: number = 0): React.ReactNode => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (value === undefined) return <span className="text-gray-500">undefined</span>;
    
    if (typeof value === 'string') {
      return <span className="text-green-600 dark:text-green-400">"{value}"</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
    }
    
    if (typeof value === 'boolean') {
      return <span className="text-purple-600 dark:text-purple-400">{String(value)}</span>;
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-500">[]</span>;
      
      return (
        <div className="ml-4">
          <span className="text-gray-600 dark:text-gray-400">[</span>
          {value.map((item, index) => (
            <div key={index} className="ml-4">
              <span className="text-gray-500">{index}: </span>
              {renderValue(item, depth + 1)}
              {index < value.length - 1 && <span className="text-gray-600 dark:text-gray-400">,</span>}
            </div>
          ))}
          <span className="text-gray-600 dark:text-gray-400">]</span>
        </div>
      );
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return <span className="text-gray-500">{'{}'}</span>;
      
      return (
        <div className="ml-4">
          <span className="text-gray-600 dark:text-gray-400">{'{'}</span>
          {entries.map(([key, val], index) => (
            <div key={key} className="ml-4">
              <span className="text-orange-600 dark:text-orange-400">"{key}"</span>
              <span className="text-gray-600 dark:text-gray-400">: </span>
              {renderValue(val, depth + 1)}
              {index < entries.length - 1 && <span className="text-gray-600 dark:text-gray-400">,</span>}
            </div>
          ))}
          <span className="text-gray-600 dark:text-gray-400">{'}'}</span>
        </div>
      );
    }
    
    return <span className="text-gray-600 dark:text-gray-400">{String(value)}</span>;
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-2xl ${className}`}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg transition-colors"
        >
          <div className="flex items-center space-x-2">
            {isOpen ? (
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono text-sm">
              🐛 {title}
            </span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            DEV
          </div>
        </button>

        {/* Content */}
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('formatted')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'formatted'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Formatted
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'raw'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Raw JSON
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 max-h-96 overflow-auto">
              {activeTab === 'formatted' ? (
                <div className="font-mono text-xs">
                  {renderValue(data)}
                </div>
              ) : (
                <pre className="font-mono text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {formatJson(data)}
                </pre>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Type: {Array.isArray(data) ? 'Array' : typeof data} 
                  {Array.isArray(data) && ` (${data.length} items)`}
                  {typeof data === 'object' && data !== null && !Array.isArray(data) && ` (${Object.keys(data).length} keys)`}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(formatJson(data));
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Copy JSON
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 