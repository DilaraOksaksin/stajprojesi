"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, Heart, MessageSquare } from "lucide-react"; 
import { Post, PostsPageClientProps, SortOrder } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/app/components/ui/sheet";
import { useLocalStorage } from "@/app/lib/useLocalStorage";
import { createActivityEntry } from "@/app/lib/activity-log";
import { useActivityLog } from "@/app/lib/useActivityLog";

export default function PostsPageClient({ posts }: PostsPageClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);
  
  const [favoritePostIds, setFavoritePostIds] = useLocalStorage<number[]>("favorites", []);
  const { addActivity } = useActivityLog();

  useEffect(() => { 
    setIsMounted(true); 
  }, []);

  // FAVORİ EKLEME VE ACTIVITY LOG'A YAZMA
  const toggleFavorite = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    const wasFavorite = favoritePostIds.includes(postId);

    setFavoritePostIds(prev =>
      wasFavorite ? prev.filter(id => id !== postId) : [...prev, postId]
    );

    const post = posts.find(p => p.id === postId);
    addActivity(
      createActivityEntry({
        type: "Favori",
        tag: `[POST:${postId}]`,
        text: wasFavorite
          ? "Gönderi favorilerden çıkarıldı"
          : "Gönderi favorilere eklendi",
      })
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  const sortedPosts = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return [];
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    let result = posts;
    if (normalizedQuery) {
      result = posts.filter(p => (p.title + p.body).toLowerCase().includes(normalizedQuery));
    }
    const sorted = [...result].sort((a, b) => a.title.localeCompare(b.title));
    return sortOrder === "desc" ? sorted.reverse() : sorted;
  }, [posts, debouncedQuery, sortOrder]);

  const PAGE_SIZE = 30; 
  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
  const pagedPosts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedPosts.slice(start, start + PAGE_SIZE);
  }, [page, sortedPosts]);

  useEffect(() => { setPage(1); }, [debouncedQuery]);

  if (!isMounted) {
    return (
      <div className="space-y-6 opacity-50">
        <div className="h-20 w-full bg-muted rounded-xl border border-border/50" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-40 w-full bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-4 rounded-xl border border-border/50">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Gönderilerde ara..." 
            className="pl-9" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="cursor-pointer">
              Sırala <ChevronDown className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer" onClick={() => setSortOrder("asc")}>A'dan Z'ye</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setSortOrder("desc")}>Z'den A'ya</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {pagedPosts.map(post => {
            const isFavorite = favoritePostIds.includes(post.id);
            return (
              <Card 
                key={post.id} 
                onClick={() => { setActivePost(post); setSheetOpen(true); }}
                className="cursor-pointer transition-all hover:bg-accent/5 border-border/40 relative group"
              >
                <CardHeader className="pb-2 pr-12">
                  <CardTitle className="text-lg font-bold line-clamp-1">{post.title}</CardTitle>
                  <button
                    onClick={(e) => toggleFavorite(e, post.id)}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Heart className={`size-5 transition-all ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground"}`} />
                  </button>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground line-clamp-2">{post.body}</CardContent>
                <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
                  <MessageSquare className="mr-1 size-3" /> Detaylar için tıkla
                </CardFooter>
              </Card>
            );
          })}

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 py-10">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer ${
                      page === pageNum 
                        ? "bg-black text-white dark:bg-white dark:text-black shadow-md scale-105" 
                        : "bg-white text-black border border-gray-200 hover:border-black dark:bg-transparent dark:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader><SheetTitle>Gönderi Detayı</SheetTitle></SheetHeader>
          {activePost && (
            <div className="mt-6">
              <h3 className="text-xl font-bold">{activePost.title}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{activePost.body}</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}