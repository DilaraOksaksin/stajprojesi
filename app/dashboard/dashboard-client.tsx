"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Star, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { mapActivityEntry } from "@/app/lib/activity-log";
import { useActivityLog } from "@/app/lib/useActivityLog";
import { useLocalStorage } from "@/app/lib/useLocalStorage";
import { getDefaultActivities } from "@/app/services/activityService";
import type { Post } from "@/app/types";
import type { User } from "@/app/types/user";
import { getPosts } from "@/app/services/postService";
import { getUsers } from "@/app/services/userService";


export default function DashboardClient({
  title = "Dashboard",
  subtitle = "Hoş geldiniz.", 
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteUsers] = useLocalStorage<number[]>("favoriteUsers", []);
  const [favoritePosts] = useLocalStorage<number[]>("favorites", []);
  const { entries: activityEntries } = useActivityLog();

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    let isActive = true;
    
    async function loadData() {
      setIsLoading(true);
      const [nextUsers, nextPosts] = await Promise.all([getUsers(), getPosts()]);

      if (isActive) {
        setUsers(nextUsers);
        setPosts(nextPosts);
        setIsLoading(false);
      }
    }

    loadData();
    return () => { isActive = false; };
  }, []);

  const stats = [
    { title: "Toplam Kullanıcı", value: users.length, icon: Users },
    { title: "Toplam Gönderi", value: posts.length, icon: FileText },
    { title: "Favori Sayısı", value: favoriteUsers.length + favoritePosts.length, icon: Star },
  ];

  const recentActivities = useMemo(() => {
    if (!isMounted) return getDefaultActivities().slice(0, 3);
    const source = activityEntries.length ? activityEntries.map(mapActivityEntry) : getDefaultActivities();
    return source.slice(0, 3);
  }, [activityEntries, isMounted]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <Card
            key={item.title}
            style={{ cursor: 'pointer' }}
            className="bg-card text-card-foreground transition-all hover:bg-accent/10 hover:shadow-md active:scale-95 border-border select-none"
          >
            <div className="pointer-events-none p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold text-foreground">{item.value}</div>
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Son Hareketler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                style={{ cursor: 'pointer' }}
                className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-accent/10 select-none group"
              >
                <div className="flex-1 space-y-1 pointer-events-none">
                  <p className="text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors">
                    {activity.text}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.tag} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}