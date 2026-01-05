"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Star, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useLocalStorage } from "@/app/lib/useLocalStorage";
import { activities } from "@/app/dashboard/activity/activity-data";

type User = {
  id: number;
};

type Post = {
  id: number;
};

type DashboardClientProps = {
  title?: string;
  subtitle?: string;
};

async function getUsers(): Promise<User[]> {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default function DashboardClient({
  title = "Dashboard",
  subtitle = "Hoş geldiniz.",
}: DashboardClientProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteUsers] = useLocalStorage<number[]>("favoriteUsers", []);
  const [favoritePosts] = useLocalStorage<number[]>("favorites", []);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      setIsLoading(true);
      const [usersData, postsData] = await Promise.all([getUsers(), getPosts()]);
      if (!isActive) return;
      setUsers(usersData);
      setPosts(postsData);
      setIsLoading(false);
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, []);

  const stats = [
    { title: "Toplam Kullanıcı", value: users.length, icon: Users },
    { title: "Toplam Gönderi", value: posts.length, icon: FileText },
    {
      title: "Favori Sayısı",
      value: favoriteUsers.length + favoritePosts.length,
      icon: Star,
    },
  ];

  const recentActivities = useMemo(() => activities.slice(0, 3), []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <Card
            key={item.title}
            className="bg-slate-50/50 transition-shadow hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {item.value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-50/50 transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="tracking-tight">Son Hareketler</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Henüz bir hareket kaydedilmedi.
            </p>
          ) : (
            <div className="space-y-3 text-sm">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {activity.tag}
                    </span>
                    <span className="text-foreground">{activity.text}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
