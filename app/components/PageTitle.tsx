"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Ana Sayfa",
  "/dashboard": "Dashboard",
  "/dashboard/posts": "GÖNDERİLER",
  "/dashboard/users": "KULLANICILAR",
  "/dashboard/activity": "AKTİVİTE",
  "/dashboard/favorites": "FAVORİLER",
  "/dashboard/logs": "LOGLAR",
  "/dashboard/settings": "AYARLAR",
  "/dashboard/settings/privacy": "GİZLİLİK",
  "/dashboard/settings/appearance": "GÖRÜNÜM",
  "/dashboard/settings/security": "GÜVENLİK",
  "/post": "Gönderiler",
  "/users": "Kullanıcılar",
};

const ROUTE_PREFIX_TITLES: Array<{ prefix: string; title: string }> = [
  { prefix: "/dashboard/posts/", title: "Gönderi" },
  { prefix: "/dashboard/users/", title: "Kullanıcı" },
  { prefix: "/dashboard/settings/", title: "Ayarlar" },
  { prefix: "/post/", title: "Gönnderi" },
  { prefix: "/post/user/", title: "Gönderi" },
  { prefix: "/users/", title: "Kullanıcı" },
];

function formatSegment(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export default function PageTitle() {
  const pathname = usePathname();

  if (pathname === "/dashboard/users" || pathname === "/post") {
    return null;
  }

  const title = useMemo(() => {
    if (!pathname) return "Sayfa";
    const directTitle = ROUTE_TITLES[pathname];
    if (directTitle) return directTitle;
    const prefixMatch = ROUTE_PREFIX_TITLES.find(({ prefix }) =>
      pathname.startsWith(prefix),
    );
    if (prefixMatch) return prefixMatch.title;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Ana Sayfa";
    return formatSegment(segments[segments.length - 1]);
  }, [pathname]);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
    </div>
  );
}

