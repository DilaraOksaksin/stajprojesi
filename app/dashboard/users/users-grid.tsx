"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { ArrowUpRight, Heart } from "lucide-react";
import type { UsersGridProps } from "@/app/types/component";
import { createActivityEntry } from "@/app/lib/activity-log";
import { useActivityLog } from "@/app/lib/useActivityLog";
import { useLocalStorage } from "@/app/lib/useLocalStorage";

const FAVORITES_KEY = "favoriteUsers";

const avatarColorClasses = [
  "bg-rose-500/15 text-rose-700",
  "bg-emerald-500/15 text-emerald-700",
  "bg-sky-500/15 text-sky-700",
  "bg-amber-500/15 text-amber-700",
  "bg-violet-500/15 text-violet-700",
  "bg-teal-500/15 text-teal-700",
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UsersGrid({ users }: UsersGridProps) {
  const [favoriteIds, setFavoriteIds] = useLocalStorage<number[]>(
    FAVORITES_KEY,
    []
  );
  const [isMounted, setIsMounted] = useState(false);
  const { addActivity } = useActivityLog();

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleFavorite = (userId: number) => {
    const wasFavorite = favoriteSet.has(userId);
    setFavoriteIds((prev) => {
      const exists = prev.includes(userId);
      const next = exists ? prev.filter((id) => id !== userId) : [...prev, userId];
      return next;
    });
    addActivity(
      createActivityEntry({
        type: "Favori",
        tag: `[USER:${userId}]`,
        text: wasFavorite
          ? "Kullanıcı favorilerden kaldırdı"
          : "Kullanıcı favorilere eklendi",
      })
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => {
        const role = user.id % 2 === 0 ? "Admin" : "User";
        const avatarClass = avatarColorClasses[user.id % avatarColorClasses.length];
        const isFavorite = isMounted && favoriteSet.has(user.id);

        return (
          <Card key={user.id} className="py-4">
            <div className="flex flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className={`h-14 w-14 ${avatarClass}`}>
                  <AvatarFallback className={`text-base font-semibold ${avatarClass}`}>
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-between gap-3 md:justify-end">
                <Badge variant={role === "Admin" ? "success" : "secondary"}>{role}</Badge>
                <div className="flex w-full max-w-xs items-center gap-2 md:w-auto">
                  <Button
                    variant={isFavorite ? "secondary" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleFavorite(user.id)}
                  >
                    <Heart className={isFavorite ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                    Favori
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/dashboard/users/${user.id}`}>
                      Detay
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
