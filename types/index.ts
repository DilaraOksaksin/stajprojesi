import { LucideIcon } from "lucide-react";
export type { User } from "./user";

// --- Ortak Tipler ---
export type SortOrder = "asc" | "desc";

// --- Post & Comment Tipleri ---
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface PostsPageClientProps {
  posts: Post[];
}
// --- User Tipleri ---
export type RoleFilter = "all" | "admin" | "user";
export type StatusFilter = "all" | "aktif" | "pasif";
export type SortOption =
  | "name-asc"
  | "name-desc"
  | "email-asc"
  | "email-desc";

export interface UsersPageClientProps {
  users: import("./user").User[];
}

// --- Activity Tipleri ---
export type ActivityType = "Arama" | "Favori" | "Kayıt";
export type DateGroup = "Tümü" | "Bugün" | "Dün" | "Son 7 Gün";

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

// --- Sidebar Navigation Tipleri ---
export type NavItem =
  | {
      title: string;
      url: string;
      icon?: LucideIcon;
    }
  | {
      title: string;
      icon: LucideIcon;
      children: { title: string; url: string }[];
    };

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// --- Theme Tipleri ---
export type ThemeMode = "light" | "dark" | "system";