"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@jiwonme/jds";
import { Button } from "@jiwonme/jds";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage?: string;
  readTime: string;
}

interface BlogSearchProps {
  posts: BlogPost[];
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  // URL에서 초기 검색어 가져오기
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // 키보드 단축키로 검색 열기 (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // 검색 쿼리에 따라 포스트 필터링
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setFilteredPosts([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = posts.filter((post) => {
      // 제목, 요약, 태그에서 검색
      const titleMatch = post.title.toLowerCase().includes(query);
      const excerptMatch = post.excerpt.toLowerCase().includes(query);
      const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
      
      return titleMatch || excerptMatch || tagMatch;
    });

    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleSelect = (slug: string) => {
    setOpen(false);
    setSearchQuery("");
    // URL에서 검색 파라미터 제거
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    const newUrl = params.toString() ? `?${params.toString()}` : '/blog';
    router.push(newUrl);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      // URL에 검색 쿼리 추가
      const params = new URLSearchParams(searchParams);
      params.set('search', searchQuery.trim());
      router.push(`/blog?${params.toString()}`);
    }
    setOpen(false);
  };

  // 검색어 하이라이트 함수
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <>
      {/* 검색 버튼 */}
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">포스트 검색...</span>
        <span className="inline-flex lg:hidden">검색...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* 검색 다이얼로그 */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="포스트 제목, 내용, 태그로 검색..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSearchSubmit();
              }
            }}
          />
          <CommandList>
            <CommandEmpty>
              {searchQuery.trim().length === 0 ? (
                "검색어를 입력해주세요."
              ) : searchQuery.trim().length < 2 ? (
                "2자 이상 입력해주세요."
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    "{searchQuery}"에 대한 검색 결과가 없습니다.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleSearchSubmit}
                  >
                    전체 검색하기
                  </Button>
                </div>
              )}
            </CommandEmpty>
            
            {filteredPosts.length > 0 && (
              <CommandGroup heading={`포스트 (${filteredPosts.length}개)`}>
                {filteredPosts.slice(0, 8).map((post) => (
                  <CommandItem
                    key={post.id}
                    value={`${post.title} ${post.excerpt} ${post.tags.join(' ')}`}
                    onSelect={() => {
                      router.push(`/blog/${post.slug}`);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="flex flex-col items-start gap-1 w-full">
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex-1">
                          <div className="font-medium text-sm line-clamp-1">
                            {highlightText(post.title, searchQuery)}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {highlightText(post.excerpt, searchQuery)}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {post.readTime}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                              tag.toLowerCase().includes(searchQuery.toLowerCase())
                                ? "bg-primary/20 text-primary border border-primary/30"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {highlightText(tag, searchQuery)}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
                {filteredPosts.length > 8 && (
                  <CommandItem 
                    value="show-more-results"
                    onSelect={handleSearchSubmit}
                  >
                    <div className="text-center w-full py-2">
                      <span className="text-sm text-muted-foreground">
                        {filteredPosts.length - 8}개의 추가 결과 보기
                      </span>
                    </div>
                  </CommandItem>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
} 