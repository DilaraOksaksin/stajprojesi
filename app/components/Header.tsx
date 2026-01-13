"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, PanelLeftIcon, Search } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useSidebar } from "@/app/components/ui/sidebar";

const NOTIFICATIONS = [
  "Dilara Okşaksin favorilere eklendi",
  "Kullanıcı #12 profili güncelledi",
  "Yeni gönderi paylaşıldı",
  "Aktivite raporu indirildi",
  "Kullanıcı #7 hesap doğruladı",
  "Yorum bildirimi alındı",
  "Yeni kullanıcı kayıt oldu",
  "Rapor başarıyla oluşturuldu",
  "Sistem bakımı planlandı",
  "Şüpheli giriş engellendi",
  "Yeni mesaj alındı",
  "Kullanıcı şifresini güncelledi",
];

const NOTIFICATION_PAGE_SIZE = 10;

const SIDEBAR_LINKS = [
  { label: "Kullanıcılar", href: "/dashboard/users" },
  { label: "Gönderiler", href: "/dashboard/posts" },
  { label: "Favoriler", href: "/dashboard/favorites" },
  { label: "Aktivite", href: "/dashboard/logs" },
  { label: "Ayarlar - Görünüm", href: "/dashboard/settings/appearance" },
  { label: "Ayarlar - Gizlilik ve Güvenlik", href: "/dashboard/settings/privacy" },
];

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const [feedOpen, setFeedOpen] = useState(false);
  const [notificationPage, setNotificationPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const feedRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!feedOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (feedRef.current?.contains(target)) return;
      setFeedOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [feedOpen]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (searchRef.current?.contains(target)) return;
      setSearchOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (!feedOpen) return;
    setNotificationPage(1);
  }, [feedOpen]);

  const notificationTotalPages = Math.max(
    1,
    Math.ceil(NOTIFICATIONS.length / NOTIFICATION_PAGE_SIZE)
  );
  const safeNotificationPage = Math.min(
    Math.max(notificationPage, 1),
    notificationTotalPages
  );
  const notificationStart = (safeNotificationPage - 1) * NOTIFICATION_PAGE_SIZE;
  const pagedNotifications = NOTIFICATIONS.slice(
    notificationStart,
    notificationStart + NOTIFICATION_PAGE_SIZE
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredLinks = useMemo(() => {
    if (!normalizedSearch) return [];
    return SIDEBAR_LINKS.filter((item) =>
      item.label.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch]);

  return (
    <header className="relative z-50 border-b border-border bg-background">
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <Button
          variant="ghost"
          className="h-9 gap-2 px-2"
          onClick={toggleSidebar}
        >
          <PanelLeftIcon className="size-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <div className="relative flex w-full max-w-xs items-center" ref={searchRef}>
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Ara..."
            className="h-9 w-full pl-9"
            aria-label="Sidebarda ara"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
          />
          {searchOpen && normalizedSearch && filteredLinks.length > 0 ? (
            <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-md border border-border bg-background shadow-md">
              <div className="flex flex-col">
                {filteredLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 text-sm text-foreground hover:bg-accent"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={feedRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                setFeedOpen((open) => !open);
              }}
              aria-expanded={feedOpen}
              aria-haspopup="dialog"
            >
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              <span className="sr-only">Bildirim Merkezi</span>
            </Button>
            {feedOpen ? (
              <div className="absolute right-0 mt-2 w-80 rounded-md border border-border bg-background p-4 shadow-md">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Bildirim Merkezi</p>
                    <p className="text-xs text-muted-foreground">Son loglar</p>
                  </div>
                  <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                    {pagedNotifications.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="rounded-md border border-border px-3 py-2 text-xs text-foreground"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  {notificationTotalPages > 1 ? (
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNotificationPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={safeNotificationPage === 1}
                      >
                        Önceki
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {safeNotificationPage} / {notificationTotalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setNotificationPage((prev) =>
                            Math.min(prev + 1, notificationTotalPages)
                          )
                        }
                        disabled={safeNotificationPage === notificationTotalPages}
                      >
                        Sonraki
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}