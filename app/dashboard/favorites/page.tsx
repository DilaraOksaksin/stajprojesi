"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Search, Star, Trash2 } from "lucide-react";
import type { User } from "@/types/user";
import { useLocalStorage } from "@/app/lib/useLocalStorage";

type Post = {
  id: number;
  title: string;
  userId: number;
};

const FAVORITE_POSTS_KEY = "favorites";
const FAVORITE_USERS_KEY = "favoriteUsers";
const PAGE_SIZE = 10;

export default function FavoritesPage() {
  const [favoritePostIds, setFavoritePostIds] = useLocalStorage<number[]>(
    FAVORITE_POSTS_KEY,
    []
  );
  const [favoriteUserIds, setFavoriteUserIds] = useLocalStorage<number[]>(
    FAVORITE_USERS_KEY,
    []
  );
  const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
  const [favoriteUsers, setFavoriteUsers] = useState<User[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let isActive = true;
    const fetchPosts = async () => {
      if (favoritePostIds.length === 0) {
        setFavoritePosts([]);
        return;
      }

      try {
        const data = await Promise.all(
          favoritePostIds.map(async (id) => {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
              cache: "no-store",
            });
            if (!res.ok) return null;
            return (await res.json()) as Post;
          })
        );

        if (isActive) {
          setFavoritePosts(data.filter((post): post is Post => Boolean(post)));
        }
      } catch {
        if (isActive) {
          setFavoritePosts([]);
        }
      }
    };

    fetchPosts();

    return () => {
      isActive = false;
    };
  }, [favoritePostIds]);

  useEffect(() => {
    let isActive = true;
    const fetchUsers = async () => {
      if (favoriteUserIds.length === 0) {
        setFavoriteUsers([]);
        return;
      }

      try {
        const data = await Promise.all(
          favoriteUserIds.map(async (id) => {
            const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
              cache: "no-store",
            });
            if (!res.ok) return null;
            return (await res.json()) as User;
          })
        );

        if (isActive) {
          setFavoriteUsers(data.filter((user): user is User => Boolean(user)));
        }
      } catch {
        if (isActive) {
          setFavoriteUsers([]);
        }
      }
    };

    fetchUsers();

    return () => {
      isActive = false;
    };
  }, [favoriteUserIds]);

  const isEmpty = useMemo(
    () => favoritePostIds.length === 0 && favoriteUserIds.length === 0,
    [favoritePostIds, favoriteUserIds]
  );

  useEffect(() => {
    setUserPage(1);
  }, [favoriteUsers.length]);

  useEffect(() => {
    setPostPage(1);
  }, [favoritePosts.length]);

  const totalUserPages = Math.max(1, Math.ceil(favoriteUsers.length / PAGE_SIZE));
  const totalPostPages = Math.max(1, Math.ceil(favoritePosts.length / PAGE_SIZE));
  const currentUserPage = Math.min(Math.max(userPage, 1), totalUserPages);
  const currentPostPage = Math.min(Math.max(postPage, 1), totalPostPages);
  const pagedUsers = useMemo(() => {
    const startIndex = (currentUserPage - 1) * PAGE_SIZE;
    return favoriteUsers.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentUserPage, favoriteUsers]);
  const pagedPosts = useMemo(() => {
    const startIndex = (currentPostPage - 1) * PAGE_SIZE;
    return favoritePosts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPostPage, favoritePosts]);

  const removeFavoritePost = (postId: number) => {
    const next = favoritePostIds.filter((id) => id !== postId);
    setFavoritePostIds(next);
    setFavoritePosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const removeFavoriteUser = (userId: number) => {
    const next = favoriteUserIds.filter((id) => id !== userId);
    setFavoriteUserIds(next);
    setFavoriteUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Star className="h-6 w-6 text-yellow-500" />
        <h1 className="text-2xl font-semibold">Favorilerim</h1>
      </div>

      {isEmpty ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Search className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Henüz hiçbir şeyi favorilere eklemedin.
            </p>
            <Button variant="outline">Keşfetmeye Başla</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {favoriteUsers.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">Kullanıcılar</p>
              <div className="flex flex-col gap-3">
                {pagedUsers.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFavoriteUser(user.id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Kaldır
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {totalUserPages >= 1 ? (
                <nav className="flex flex-wrap items-center justify-center gap-2 pt-4">
                  {Array.from({ length: totalUserPages }, (_, index) => {
                    const pageNumber = index + 1;
                    const isActive = pageNumber === currentUserPage;
                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setUserPage(pageNumber)}
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
          ) : null}

          {favoritePosts.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">Gönderiler</p>
              <div className="flex flex-col gap-3">
                {pagedPosts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{post.title}</p>
                        <p className="text-xs text-muted-foreground">Post #{post.id}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFavoritePost(post.id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Kaldır
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {totalPostPages >= 1 ? (
                <nav className="flex flex-wrap items-center justify-center gap-2 pt-4">
                  {Array.from({ length: totalPostPages }, (_, index) => {
                    const pageNumber = index + 1;
                    const isActive = pageNumber === currentPostPage;
                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPostPage(pageNumber)}
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
          ) : null}
        </div>
      )}
    </div>
  );
}
