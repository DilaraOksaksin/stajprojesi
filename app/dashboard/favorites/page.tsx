"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Search, Star, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/app/lib/useLocalStorage";

// --- DÜZELTME: MERKEZİ TİPLER ---
import { User, Post } from "@/app/types";
import { getPostsByIds } from "@/app/services/postService";
import { getUsersByIds } from "@/app/services/userService";

const FAVORITE_POSTS_KEY = "favorites";
const FAVORITE_USERS_KEY = "favoriteUsers";
const PAGE_SIZE = 10;

export default function FavoritesPage() {
  const [favoritePostIds, setFavoritePostIds] = useLocalStorage<number[]>(FAVORITE_POSTS_KEY, []);
  const [favoriteUserIds, setFavoriteUserIds] = useLocalStorage<number[]>(FAVORITE_USERS_KEY, []);
  
  const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
  const [favoriteUsers, setFavoriteUsers] = useState<User[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  //  Hydration ve Sidebar Kayması Çözümü
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Favori Postları Çekme
  useEffect(() => {
    if (!isMounted) return;
    let isActive = true;

    const fetchPosts = async () => {
      if (favoritePostIds.length === 0) {
        setFavoritePosts([]);
        return;
      }

      const data = await getPostsByIds(favoritePostIds, { cache: "no-store" });
      if (isActive) setFavoritePosts(data);
    };

    fetchPosts();
    return () => { isActive = false; };
  }, [favoritePostIds, isMounted]);

  // Favori Kullanıcıları Çekme
  useEffect(() => {
    if (!isMounted) return;
    let isActive = true;

    const fetchUsers = async () => {
      if (favoriteUserIds.length === 0) {
        setFavoriteUsers([]);
        return;
      }

      const data = await getUsersByIds(favoriteUserIds, { cache: "no-store" });
      if (isActive) setFavoriteUsers(data);
    };

    fetchUsers();
    return () => { isActive = false; };
  }, [favoriteUserIds, isMounted]);

  const isEmpty = useMemo(
    () => favoritePostIds.length === 0 && favoriteUserIds.length === 0,
    [favoritePostIds, favoriteUserIds]
  );

  // Sayfalama Mantığı
  const totalUserPages = Math.ceil(favoriteUsers.length / PAGE_SIZE) || 1;
  const totalPostPages = Math.ceil(favoritePosts.length / PAGE_SIZE) || 1;

  const pagedUsers = useMemo(() => {
    const start = (userPage - 1) * PAGE_SIZE;
    return favoriteUsers.slice(start, start + PAGE_SIZE);
  }, [userPage, favoriteUsers]);

  const pagedPosts = useMemo(() => {
    const start = (postPage - 1) * PAGE_SIZE;
    return favoritePosts.slice(start, start + PAGE_SIZE);
  }, [postPage, favoritePosts]);

  const removeFavoritePost = (postId: number) => {
    setFavoritePostIds(prev => prev.filter(id => id !== postId));
  };

  const removeFavoriteUser = (userId: number) => {
    setFavoriteUserIds(prev => prev.filter(id => id !== userId));
  };

  // Sidebar bozulmasını önlemek için iskelet yapı
  if (!isMounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded-md" />
        <div className="h-64 w-full bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 min-h-screen">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Favorilerim</h1>
          <p className="text-sm text-muted-foreground">
            Sık takip ettiğin kullanıcılar ve gönderiler burada listelenir.
          </p>
        </div>
      </div>

      {/* Boş durum */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-12">
          <div className="p-3 rounded-full bg-muted">
            <Star className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Henüz favori eklemedin.
          </p>
          <p className="text-xs text-muted-foreground">
            Gönderiler ve kullanıcılar sayfasından kalp ikonuna tıklayarak favori ekleyebilirsin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Favori Kullanıcılar */}
          <Card className="h-full">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">Favori Kullanıcılar</h2>
                </div>
                {favoriteUsers.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setFavoriteUserIds([])}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {favoriteUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Favori kullanıcı bulunamadı.
                </p>
              ) : (
                <div className="space-y-3">
                  {pagedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFavoriteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {totalUserPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      {Array.from({ length: totalUserPages }, (_, i) => {
                        const page = i + 1;
                        const isActive = page === userPage;
                        return (
                          <button
                            key={page}
                            onClick={() => setUserPage(page)}
                            className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-background text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Favori Gönderiler */}
          <Card className="h-full">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">Favori Gönderiler</h2>
                </div>
                {favoritePosts.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setFavoritePostIds([])}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {favoritePosts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Favori gönderi bulunamadı.
                </p>
              ) : (
                <div className="space-y-3">
                  {pagedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <div className="space-y-1">
                        <p className="font-medium line-clamp-1">{post.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {post.body}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-1 h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFavoritePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {totalPostPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      {Array.from({ length: totalPostPages }, (_, i) => {
                        const page = i + 1;
                        const isActive = page === postPage;
                        return (
                          <button
                            key={page}
                            onClick={() => setPostPage(page)}
                            className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-background text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}