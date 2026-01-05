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
                {favoriteUsers.map((user) => (
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
            </div>
          ) : null}

          {favoritePosts.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">Gönderiler</p>
              <div className="flex flex-col gap-3">
                {favoritePosts.map((post) => (
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
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
