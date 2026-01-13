"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Search } from "lucide-react";
import { activities, type ActivityItem } from "./activity-data";
import { mapActivityEntry } from "@/app/lib/activity-log";
import { useActivityLog } from "@/app/lib/useActivityLog";

const badgeStyles: Record<ActivityItem["type"], string> = {
  Arama: "border-transparent bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:text-blue-200",
  Favori:
    "border-transparent bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:text-amber-200",
  Kayıt:
    "border-transparent bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-200",
};

export default function ActivityPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { entries: activityEntries } = useActivityLog();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sourceActivities = useMemo(() => {
    if (!isMounted) return activities;
    return activityEntries.length ? activityEntries.map(mapActivityEntry) : activities;
  }, [activityEntries, isMounted]);
  const [typeFilter, setTypeFilter] = useState<"Tümü" | ActivityItem["type"]>("Tümü");
  const [dateFilter, setDateFilter] = useState<"Tümü" | ActivityItem["dateGroup"]>("Tümü");

  const filteredActivities = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLocaleLowerCase("tr-TR");

    return sourceActivities.filter((activity) => {
      const matchesType = typeFilter === "Tümü" || activity.type === typeFilter;
      const matchesDate = dateFilter === "Tümü" || activity.dateGroup === dateFilter;
      const matchesText =
        normalizedQuery.length === 0 ||
        `${activity.tag} ${activity.text}`
          .toLocaleLowerCase("tr-TR")
          .includes(normalizedQuery);

      return matchesType && matchesDate && matchesText;
    });
  }, [searchTerm, typeFilter, dateFilter, sourceActivities]);

  const canClearFilters = searchTerm.length > 0 || typeFilter !== "Tümü" || dateFilter !== "Tümü";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Sistem Hareketleri</h1>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
        <div className="relative w-full min-w-[220px] flex-1 md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Aktivitelerde ara..."
            className="pl-9"
          />
        </div>
        <Tabs value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
          <TabsList className="h-9">
            <TabsTrigger value="Tümü">Tümü</TabsTrigger>
            <TabsTrigger value="Arama">Arama</TabsTrigger>
            <TabsTrigger value="Favori">Favori</TabsTrigger>
            <TabsTrigger value="Kayıt">Kayıt</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs value={dateFilter} onValueChange={(value) => setDateFilter(value as typeof dateFilter)}>
          <TabsList className="h-9">
            <TabsTrigger value="Tümü">Tümü</TabsTrigger>
            <TabsTrigger value="Bugün">Bugün</TabsTrigger>
            <TabsTrigger value="Dün">Dün</TabsTrigger>
            <TabsTrigger value="Son 7 Gün">Son 7 Gün</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearchTerm("");
            setTypeFilter("Tümü");
            setDateFilter("Tümü");
          }}
          disabled={!canClearFilters}
        >
          Filtreleri Temizle
        </Button>
      </div>
      {filteredActivities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {sourceActivities.length === 0
            ? "Henüz bir hareket kaydedilmedi"
            : "Filtrelere uygun bir hareket bulunamadı"}
        </p>
      ) : (
        <div className="space-y-2">
          {filteredActivities.map((activity) => (
            <Card
              key={activity.id}
              className="border border-border/60 transition-colors hover:border-primary/60"
            >
              <CardContent className="flex items-center gap-4 py-2">
                <activity.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-1 flex-wrap items-center gap-2 text-sm text-foreground">
                  <span className="font-mono text-xs text-muted-foreground">{activity.tag}</span>
                  <Badge className={badgeStyles[activity.type]}>{activity.type}</Badge>
                 
                  <span>AAAAAAAAAA</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{activity.time}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
