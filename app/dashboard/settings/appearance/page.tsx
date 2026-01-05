"use client";

import { useTheme } from "next-themes";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

type ThemeMode = "light" | "dark" | "system";

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();
  const mode = (theme ?? "system") as ThemeMode;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Görünüm</h1>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Tema</p>
              <p className="text-xs text-muted-foreground">Chrome Renkleri</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setTheme("system")}>
              Varsayılana sıfırla
            </Button>
          </div>

          <div className="flex items-center justify-between border-b border-border pb-6">
            <div>
              <p className="text-sm font-medium text-foreground">Araç çubuğunuzu özelleştirin</p>
            </div>
            <span className="text-xs text-muted-foreground">Yeni sekme</span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Mod</p>
            </div>
            <select
              value={mode}
              onChange={(event) => setTheme(event.target.value as ThemeMode)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring md:w-48"
            >
              <option value="light">Açık</option>
              <option value="dark">Koyu</option>
              <option value="system">Sistem</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


