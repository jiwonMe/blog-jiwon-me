"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Skeleton } from "@jiwonme/jds";
import { ThumbnailPlaceholder } from "../../components/thumbnail-placeholder";
import { BlogSearch } from "../../components/blog-search";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

interface BlogPageClientProps {
  initialPosts: BlogPost[];
  allPosts: BlogPost[];
  allTags: string[];
  initialSearchQuery: string;
}

export function BlogPageClient({ 
  initialPosts, 
  allPosts, 
  allTags, 
  initialSearchQuery 
}: BlogPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string>("전체");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  // URL 검색 파라미터 변경 감지
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search') || "";
    setSearchQuery(urlSearchQuery);
    
    // 검색 쿼리에 따른 필터링
    let posts = allPosts;
    if (urlSearchQuery && urlSearchQuery.trim()) {
      const query = urlSearchQuery.toLowerCase();
      posts = allPosts.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const excerptMatch = post.excerpt.toLowerCase().includes(query);
        const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
        
        return titleMatch || excerptMatch || tagMatch;
      });
    }
    
    // 태그 필터링 적용
    if (selectedTag !== "전체") {
      posts = posts.filter(post => post.tags.includes(selectedTag));
    }
    
    setFilteredPosts(posts);
  }, [searchParams, allPosts, selectedTag]);

  // 태그 필터링
  useEffect(() => {
    let posts = allPosts;
    
    // 검색 쿼리 적용
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = allPosts.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const excerptMatch = post.excerpt.toLowerCase().includes(query);
        const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
        
        return titleMatch || excerptMatch || tagMatch;
      });
    }
    
    // 태그 필터링 적용
    if (selectedTag !== "전체") {
      posts = posts.filter(post => post.tags.includes(selectedTag));
    }
    
    setFilteredPosts(posts);
  }, [selectedTag, allPosts, searchQuery]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
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
    <div className="container mx-auto px-4 py-8 md:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">블로그</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          개발하면서 배운 것들과 경험을 기록하고 공유합니다.
        </p>
        
        {/* Search */}
        <div className="flex justify-center">
          <BlogSearch posts={allPosts} />
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">"{searchQuery}"</span>에 대한 검색 결과: 
            <span className="font-medium text-foreground ml-1">
              {filteredPosts.length}개의 포스트
            </span>
          </p>
        </div>
      )}

      {/* Tags Filter */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">태그별 필터</h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedTag === "전체" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleTagClick("전체")}
          >
            전체
          </Button>
          {allTags.map((tag) => (
            <Button 
              key={tag} 
              variant={selectedTag === tag ? "default" : "ghost"} 
              size="sm"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery 
                ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
                : selectedTag === "전체" 
                  ? "아직 게시된 포스트가 없습니다." 
                  : `"${selectedTag}" 태그에 해당하는 포스트가 없습니다.`
              }
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="sm:w-48 sm:h-32 aspect-video sm:aspect-auto overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 relative">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 192px"
                      priority={false}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      loading="lazy"
                    />
                  ) : (
                    <ThumbnailPlaceholder 
                      title={post.title}
                      tags={post.tags}
                      size="sm"
                      className="w-full h-full"
                    />
                  )}
                </div>
                
                <div className="p-4 sm:p-6 flex flex-col space-y-3 flex-1 min-w-0">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer transition-colors ${
                          selectedTag === tag 
                            ? "bg-primary text-primary-foreground" 
                            : searchQuery && tag.toLowerCase().includes(searchQuery.toLowerCase())
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                        onClick={() => handleTagClick(tag)}
                      >
                        {searchQuery ? highlightText(tag, searchQuery) : tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {searchQuery ? highlightText(post.title, searchQuery) : post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {searchQuery ? highlightText(post.excerpt, searchQuery) : post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <time>
                        {new Date(post.date).toLocaleDateString('ko-KR')}
                      </time>
                      <span>•</span>
                      <span>{post.readTime} 읽기</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-medium text-primary hover:underline flex-shrink-0"
                    >
                      계속 읽기 →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Pagination or Load More */}
      {filteredPosts.length > 0 && (
        <div className="text-center mt-12">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? `"${searchQuery}" 검색 결과: ${filteredPosts.length}개의 포스트`
                : selectedTag === "전체" 
                  ? `총 ${filteredPosts.length}개의 포스트`
                  : `"${selectedTag}" 태그: ${filteredPosts.length}개의 포스트`
              }
            </p>
            {filteredPosts.length >= 10 && (
              <Button variant="outline" size="lg">
                더 많은 포스트 보기
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 