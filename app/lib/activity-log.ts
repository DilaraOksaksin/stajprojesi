import { Search, Star, User } from "lucide-react";
import type { ActivityItem as ActivityItemShape } from "@/app/dashboard/activity/activity-data";

export type ActivityType = ActivityItemShape["type"];
export type ActivityDateGroup = ActivityItemShape["dateGroup"];
export type ActivityItem = ActivityItemShape;

export type ActivityLogEntry = {
  id: number;
  type: ActivityType;
  tag: string;
  text: string;
  timestamp: string;
};

export const ACTIVITY_LOG_KEY = "activityLog";

export function createActivityEntry(input: {
  type: ActivityType;
  tag: string;
  text: string;
  timestamp?: string;
}): ActivityLogEntry {
  return {
    id: Date.now(),
    type: input.type,
    tag: input.tag,
    text: input.text,
    timestamp: input.timestamp ?? new Date().toISOString(),
  };
}

function getDateGroup(date: Date): ActivityDateGroup {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfEntry = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfEntry.getTime()) / (24 * 60 * 60 * 1000)
  );

  if (diffDays <= 0) return "Bugün" as ActivityDateGroup;
  if (diffDays === 1) return "Dün" as ActivityDateGroup;
  return "Son 7 Gün" as ActivityDateGroup;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function getIcon(type: ActivityType): ActivityItem["icon"] {
  if (type === "Favori") return Star;
  if (type === "Arama") return Search;
  return User;
}

export function mapActivityEntry(entry: ActivityLogEntry): ActivityItem {
  const date = new Date(entry.timestamp);
  return {
    ...entry,
    icon: getIcon(entry.type),
    dateGroup: getDateGroup(date),
    time: formatTime(date),
  };
}
