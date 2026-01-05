"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type NavItem =
  | { title: string; url: string; icon: React.ComponentType }
  | {
      title: string;
      icon: React.ComponentType;
      children: { title: string; url: string }[];
    };

type NavGroup = {
  label: string;
  items: NavItem[];
};

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
          { title: "Diller", url: "/dashboard/settings/languages" },
        ],
      },
    ],
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(true);

  const isActivePath = (url?: string) =>
    !!url && (pathname === url || (url !== "/" && pathname.startsWith(`${url}/`)));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="group">
              <Link href="/" className="flex items-center gap-3 px-2 py-2">
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
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = "url" in item ? isActivePath(item.url) : false;
                  return (
                    <SidebarMenuItem key={item.title}>
                      {"children" in item ? (
                        <>
                          <SidebarMenuButton
                            onClick={() => setSettingsOpen((open) => !open)}
                            className={
                              settingsOpen
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }
                            aria-expanded={settingsOpen}
                            aria-controls="settings-submenu"
                          >
                            <item.icon />
                            <span className="group-data-[state=collapsed]:hidden">
                              {item.title}
                            </span>
                          </SidebarMenuButton>
                          {settingsOpen ? (
                            <div
                              id="settings-submenu"
                              className="mt-1 ml-6 flex flex-col gap-1 group-data-[state=collapsed]:hidden"
                            >
                              {item.children.map((child) => {
                                const isChildActive = isActivePath(child.url);
                                return (
                                  <Link
                                    key={child.title}
                                    href={child.url}
                                    aria-current={isChildActive ? "page" : undefined}
                                    className={
                                      isChildActive
                                        ? "rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
                                        : "rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    }
                                  >
                                    <span className="group-data-[state=collapsed]:hidden">
                                      {child.title}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          className={
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }
                        >
                        <Link href={item.url} aria-current={isActive ? "page" : undefined}>
                          <item.icon />
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
        <div className="border-sidebar-border bg-sidebar-accent/30 flex items-center gap-3 rounded-lg border p-2">
          <Avatar className="h-9 w-9">
          <AvatarImage src="/avatar.png" alt="Dilara Okşaksin" />
          <AvatarFallback>DO</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col text-xs group-data-[state=collapsed]:hidden">
            <span className="truncate font-semibold text-sidebar-foreground">Dilara Okşaksin</span>
            <span className="text-sidebar-foreground/60">Admin</span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}




