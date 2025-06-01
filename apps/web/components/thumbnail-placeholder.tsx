interface ThumbnailPlaceholderProps {
  title: string;
  tags: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThumbnailPlaceholder({ 
  title, 
  tags, 
  size = 'md',
  className = '' 
}: ThumbnailPlaceholderProps) {
  const primaryTag = tags[0] || 'Blog';
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  };
  
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center justify-center text-center p-4">
        <div className={`${sizeClasses[size]} rounded-full bg-primary/20 flex items-center justify-center mb-2`}>
          <svg
            className={`${iconSizes[size]} text-primary/60`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className={`${textSizes[size]} text-muted-foreground font-medium`}>
          {primaryTag}
        </div>
      </div>
    </div>
  );
} 