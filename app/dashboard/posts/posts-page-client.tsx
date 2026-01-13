"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Heart, MessageSquare, Search } from "lucide-react";

import { createActivityEntry } from "@/app/lib/activity-log";
import { useActivityLog } from "@/app/lib/useActivityLog";
import { useLocalStorage } from "@/app/lib/useLocalStorage";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

type Post = {
  id: number;
  title: string;
  body: string;
};

type Comment = {
  id: number;
  name: string;
  email: string;
  body: string;
};

type PostsPageClientProps = {
  posts: Post[];
};

export default function PostsPageClient({ posts }: PostsPageClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [favoritePostIds, setFavoritePostIds] = useLocalStorage<number[]>(
    "favorites",
    []
  );
  const { addActivity } = useActivityLog();
  const mountedFavorites = isMounted ? favoritePostIds : [];
  const favoriteSet = useMemo(
    () => new Set(mountedFavorites),
    [mountedFavorites]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return posts;
    return posts.filter((post) => {
      const content = `${post.title} ${post.body}`.toLowerCase();
      return content.includes(normalizedQuery);
    });
  }, [posts, query]);

  const sortedPosts = useMemo(() => {
    const next = [...filteredPosts];
    next.sort((a, b) => a.title.localeCompare(b.title));
    if (sortOrder === "desc") {
      next.reverse();
    }
    return next;
  }, [filteredPosts, sortOrder]);

  const PAGE_SIZE = 30;
  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pagedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedPosts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, sortedPosts]);

  useEffect(() => {
    setPage(1);
  }, [query, sortOrder]);

  const featuredPosts = useMemo(() => {
    return [...filteredPosts]
      .sort((a, b) => a.body.length - b.body.length)
      .slice(0, 4);
  }, [filteredPosts]);

  useEffect(() => {
    if (!activePost) {
      setComments([]);
      setCommentsError(null);
      setCommentsLoading(false);
      return;
    }

    let isActive = true;
    setCommentsLoading(true);
    setCommentsError(null);

    fetch(`https://jsonplaceholder.typicode.com/posts/${activePost.id}/comments`)
      .then((res) => res.json())
      .then((data: Comment[]) => {
        if (!isActive) return;
        setComments(data);
      })
      .catch(() => {
        if (!isActive) return;
        setCommentsError("Yorumlar yüklenemedi.");
      })
      .finally(() => {
        if (!isActive) return;
        setCommentsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [activePost]);

  const handleOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setActivePost(null);
    }
  };

  const handleCardSelect = (post: Post) => {
    setActivePost(post);
    setSheetOpen(true);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent, post: Post) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardSelect(post);
    }
  };

  const toggleFavorite = (event: React.MouseEvent, postId: number) => {
    event.stopPropagation();
    const wasFavorite = favoriteSet.has(postId);
    setFavoritePostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
    addActivity(
      createActivityEntry({
        type: "Favori",
        tag: `[POST:${postId}]`,
        text: wasFavorite
          ? "Gönderi favorilerden çıkarıldı"
          : "Gönderi favorilere eklendi",
      })
    );
    window.dispatchEvent(new CustomEvent("favoritesChanged"));
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Sosyal Medya Akışı</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Son gönderiler ve öne çıkanlar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Gönderilerde ara..."
                    className="h-9 w-full pl-9"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    aria-label="Gönderilerde ara"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 gap-2">
                      Sırala
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                      A'dan Z'ye
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                      Z'den A'ya
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredPosts.length} gönderi görüntüleniyor.
              </p>
            </div>

            {pagedPosts.map((post) => (
              <Card
                key={post.id}
                className="gap-4 cursor-pointer transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                role="button"
                tabIndex={0}
                onClick={() => handleCardSelect(post)}
                onKeyDown={(event) => handleCardKeyDown(event, post)}
              >
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-semibold">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {post.body}
                </CardContent>
                <CardFooter className="justify-between">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                    onClick={(event) => toggleFavorite(event, post.id)}
                    aria-pressed={favoriteSet.has(post.id)}
                    aria-label={
                      favoriteSet.has(post.id)
                        ? "Favoriden çıkar"
                        : "Favoriye ekle"
                    }
                  >
                    <Heart
                      className={`size-4 ${
                        favoriteSet.has(post.id)
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    {favoriteSet.has(post.id)
                      ? "Favoriden çıkar"
                      : "Favoriye ekle"}
                  </button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="size-4" />
                    Yorumlar
                  </div>
                </CardFooter>
              </Card>
            ))}
            {pagedPosts.length === 0 ? (
              <Card className="gap-3">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base">Sonuç bulunamadı</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Arama kriterinizi değiştirip tekrar deneyin.
                </CardContent>
              </Card>
            ) : null}
            {totalPages > 1 ? (
              <nav className=" flex flex-wrap items-center justify-center gap-2 pt-4">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === currentPage;
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        isActive
                          ? "rounded-md border border-primary bg-primary px-3 py-1 text-sm text-primary-foreground"
                          : "rounded-md border border-border px-3 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </nav>
            ) : null}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Öne Çıkan Gönderiler</h2>
            <div className="space-y-4">
              {featuredPosts.map((post) => (
                <Card
                  key={`featured-${post.id}`}
                  className="gap-3 cursor-pointer transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardSelect(post)}
                  onKeyDown={(event) => handleCardKeyDown(event, post)}
                >
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    {post.body}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="sm:max-w-lg">
          <SheetHeader className="border-b">
            <SheetTitle>Gönderi Detayı</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <Tabs defaultValue="content" className="mt-4">
              <TabsList className="mb-4">
                <TabsTrigger value="content">İçerik</TabsTrigger>
                <TabsTrigger value="comments">Yorumlar</TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                {activePost ? (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">
                      {activePost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activePost.body}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Bir gönderi seçin.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="comments">
                {commentsLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Yorumlar yükleniyor...
                  </p>
                ) : commentsError ? (
                  <p className="text-sm text-destructive">{commentsError}</p>
                ) : comments.length > 0 ? (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-lg border border-border p-3 text-sm"
                      >
                        <p className="font-medium text-foreground">
                          {comment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {comment.email}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {comment.body}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Bu gönderi için yorum bulunamadı.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
