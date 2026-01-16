"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- DÜZELTME: TİPLERİ MERKEZİ DOSYADAN ALIYORUZ ---
import { NavGroup, NavItem } from "@/app/types";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "./ui/sidebar";

import {
  Activity,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

// Menü Yapılandırması 
const navigationGroups: NavGroup[] = [
  {
    label: "YÖNETİM",
    items: [
      { title: "Kullanıcılar", url: "/dashboard/users", icon: Users },
      { title: "Gönderiler", url: "/dashboard/posts", icon: FileText },
    ],
  },
  {
    label: "TAKİP",
    items: [
      { title: "Favoriler", url: "/dashboard/favorites", icon: Star },
      { title: "Aktivite", url: "/dashboard/logs", icon: Activity },
    ],
  },
  {
    label: "SİSTEM",
    items: [
      {
        title: "Ayarlar",
        icon: ShieldCheck,
        children: [
          { title: "Görünüm", url: "/dashboard/settings/appearance" },
          { title: "Gizlilik ve Güvenlik", url: "/dashboard/settings/privacy" },
        ],
      },
    ],
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(true);

  // Aktif yol kontrolü için yardımcı fonksiyon
  const isActivePath = (url?: string) =>
    !!url && (pathname === url || (url !== "/" && pathname.startsWith(`${url}/`)));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="group">
              <Link href="/dashboard" className="flex items-center gap-3 px-2 py-2">
                <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md shrink-0">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                <div className="grid text-left text-sm leading-tight group-data-[state=collapsed]:hidden">
                  <span className="truncate font-semibold">Staj Projesi</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="group-data-[state=collapsed]:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = "url" in item ? isActivePath(item.url) : false;
                  const hasActiveChild =
                    "children" in item &&
                    item.children.some((child) => isActivePath(child.url));

                  return (
                    <SidebarMenuItem key={item.title}>
                      {"children" in item ? (
                        <>
                          <SidebarMenuButton
                            onClick={() => setSettingsOpen((open) => !open)}
                            className={
                              hasActiveChild
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }
                          >
                            {item.icon && <item.icon />}
                            <span className="group-data-[state=collapsed]:hidden">
                              {item.title}
                            </span>
                          </SidebarMenuButton>
                          {settingsOpen && (
                            <div className="mt-1 ml-6 flex flex-col gap-1 border-l border-border pl-2 group-data-[state=collapsed]:hidden">
                              {item.children.map((child) => {
                                const isChildActive = isActivePath(child.url);
                                return (
                                  <Link
                                    key={child.title}
                                    href={child.url}
                                    className={`rounded-md px-2 py-1.5 text-xs transition-colors ${
                                      isChildActive
                                        ? "bg-primary text-primary-foreground font-medium"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    }`}
                                  >
                                    {child.title}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          className={
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }
                        >
                          <Link href={item.url}>
                            {item.icon && <item.icon />}
                            <span className="group-data-[state=collapsed]:hidden">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="border-sidebar-border bg-sidebar-accent/30 flex items-center gap-3 rounded-lg border p-2 group-data-[state=collapsed]:hidden">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback className="text-[10px] font-bold">DO</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col text-xs">
            <span className="truncate font-semibold text-foreground">Dilara Okşaksin</span>
            <span className="text-muted-foreground/80">Yazılım Stajyeri</span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}