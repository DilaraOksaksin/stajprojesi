"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FavoriButonu from "@/app/components/FavoriButonu";
import type { Post } from "@/app/types";
import { getPostsByUserId } from "@/app/services/postService";
import { getUserById } from "@/app/services/userService";

export default function UserPostsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchPosts = async () => {
      const userId = Array.isArray(id) ? id[0] : id;

      const [user, userPosts] = await Promise.all([
        getUserById(userId, { cache: "no-store" }),
        getPostsByUserId(userId, { cache: "no-store" }),
      ]);

      if (!user) {
        setError("Kullanıcı bilgisi alınamadı");
        setLoading(false);
        return;
      }

      setName(user.name);
      setPosts(userPosts);
      setError(null);
      setLoading(false);
    };

    fetchPosts();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        YÃ¼kleniyor...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <p>Bir hata oluÅŸtu: {error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition"
        >
          Ana Sayfaya DÃ¶n
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        Kullanıcı: {name}'in Gönderileri
      </h1>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Bu kullanıcıya ait gönderi bulunamadı.</p>
      ) : (
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative bg-card border border-border hover:bg-accent backdrop-blur-sm p-6 rounded-2xl shadow-lg transition-all"
            >
              {/* Favori Butonu */}
              <FavoriButonu id={post.id} />
              
              {/* Post */}
              <div className="mt-8">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Post #{post.id}</span>
                </div>
                <h2 className="text-lg font-semibold mb-2 text-card-foreground">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground">{post.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

