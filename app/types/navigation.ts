/**
 * Navigation domain tipleri
 */

import type { LucideIcon } from "lucide-react";

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

