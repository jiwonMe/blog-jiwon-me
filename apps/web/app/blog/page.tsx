"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Skeleton } from "@jiwonme/jds";
// Remove direct import of server functions
import { ThumbnailPlaceholder } from "../../components/thumbnail-placeholder";
import { BlogSearch } from "../../components/blog-search";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("전체");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const urlSearchQuery = searchParams.get('search');
        const searchParam = urlSearchQuery ? `?search=${encodeURIComponent(urlSearchQuery)}` : '';
        
        const response = await fetch(`/api/blog${searchParam}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog data');
        }
        const { blogPosts: posts, allTags: tags, searchQuery: returnedSearchQuery } = await response.json();
        setBlogPosts(posts);
        setAllTags(tags);
        setFilteredPosts(posts);
        setSearchQuery(returnedSearchQuery || "");
      } catch (error) {
        console.error('Error fetching blog data:', error);
        // Set empty arrays as fallback
        setBlogPosts([]);
        setAllTags([]);
        setFilteredPosts([]);
        setSearchQuery("");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // Filter posts when selected tag changes
  useEffect(() => {
    if (selectedTag === "전체") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter(post => post.tags.includes(selectedTag)));
    }
  }, [selectedTag, blogPosts]);

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

  // Skeleton component for loading state
  const BlogPostSkeleton = () => (
    <article className="border rounded-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail skeleton */}
        <div className="sm:w-48 sm:h-32 aspect-video sm:aspect-auto flex-shrink-0">
          <Skeleton className="w-full h-full" />
        </div>
        
        <div className="p-4 sm:p-6 flex flex-col space-y-3 flex-1 min-w-0">
          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-14" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Excerpt skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Meta skeleton */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </article>
  );

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
          <BlogSearch posts={blogPosts} />
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
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-14" />
              <Skeleton className="h-8 w-18" />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Blog Posts */}
      <div className="space-y-6">
        {isLoading ? (
          // Show skeleton while loading
          Array.from({ length: 3 }).map((_, index) => (
            <BlogPostSkeleton key={index} />
          ))
        ) : filteredPosts.length === 0 ? (
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
      {isLoading ? (
        <div className="text-center mt-12">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      ) : filteredPosts.length > 0 && (
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