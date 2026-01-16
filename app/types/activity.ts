
import type { LucideIcon } from "lucide-react";

export type ActivityType = "Arama" | "Favori" | "Kayıt";
export type DateGroup = "Tümü" | "Bugün" | "Dün" | "Son 7 Gün";

export type ActivityDateGroup = Exclude<DateGroup, "Tümü">;

export interface ActivityItem {
  id: number;
  type: ActivityType;
  text: string;
  tag: string;
  time: string;
  icon: LucideIcon;
  dateGroup: DateGroup;
}

export type ActivityLogEntry = {
  id: number;
  type: ActivityType;
  tag: string;
  text: string;
  timestamp: string;
};

