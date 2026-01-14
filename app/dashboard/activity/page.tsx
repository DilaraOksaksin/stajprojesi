"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
// TİPLER MERKEZİ DOSYADAN GELİYOR
import { Post, PostsPageClientProps, SortOrder } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/app/components/ui/sheet";

export default function PostsPageClient({ posts }: PostsPageClientProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);

  // DEBOUNCE EFFECT: Gereksiz render'ı önlemek için
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  // SIRALAMA VE FİLTRELEME: "result is not iterable" hatası giderildi
  const sortedPosts = useMemo(() => {
    // Güvenlik kontrolü: posts dizi değilse boş dizi dön
    if (!posts || !Array.isArray(posts)) return [];

    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    let result = posts;

    if (normalizedQuery) {
      result = posts.filter(p => 
        (p.title + p.body).toLowerCase().includes(normalizedQuery)
      );
    }

    // Yayma operatöründen önce verinin dizi olduğundan emin oluyoruz
    const sorted = [...(result || [])].sort((a, b) => a.title.localeCompare(b.title));
    return sortOrder === "desc" ? sorted.reverse() : sorted;
  }, [posts, debouncedQuery, sortOrder]);

  // SAYFALAMA MANTIĞI: 30 Gönderi
  const PAGE_SIZE = 30;
  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
  const pagedPosts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedPosts.slice(start, start + PAGE_SIZE);
  }, [page, sortedPosts]);

  // Arama değişince 1. sayfaya dön
  useEffect(() => { setPage(1); }, [debouncedQuery]);

  const handleCardClick = (post: Post) => {
    setActivePost(post);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Üst Bar */}
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
            <Button variant="outline" style={{ cursor: 'pointer' }}>
              Sırala <ChevronDown className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem style={{ cursor: 'pointer' }} onClick={() => setSortOrder("asc")}>A'dan Z'ye</DropdownMenuItem>
            <DropdownMenuItem style={{ cursor: 'pointer' }} onClick={() => setSortOrder("desc")}>Z'den A'ya</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Gönderi Listesi */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {pagedPosts.map(post => (
            <Card 
              key={post.id} 
              onClick={() => handleCardClick(post)} 
              className="cursor-pointer transition-all hover:bg-accent/5 border-border/40"
            >
              <CardHeader className="pb-2"><CardTitle className="text-lg font-bold">{post.title}</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">{post.body}</CardContent>
            </Card>
          ))}

          {/* AYRIK KUTULU SAYFALAMA TASARIMI */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 py-10">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                const isActive = page === pageNum;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm ${
                      isActive 
                        ? "bg-black text-white dark:bg-white dark:text-black shadow-md scale-105" 
                        : "bg-white text-black border border-gray-200 hover:border-black dark:bg-transparent dark:text-white"
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detay Paneli */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader><SheetTitle>Gönderi Detayı</SheetTitle></SheetHeader>
          <div className="mt-6">
            <h3 className="text-xl font-bold">{activePost?.title}</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">{activePost?.body}</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}