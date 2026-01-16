"use client";

import { useTheme } from "next-themes";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/app/components/ui/dropdown-menu";
import type { ThemeMode } from "@/app/types";

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();
  const mode = (theme ?? "system") as ThemeMode;

  const modeLabels = {
    light: "Açık",
    dark: "Koyu",
    system: "Sistem"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Görünüm</h1>
        <p className="mt-2 text-sm text-muted-foreground">Uygulamanın görünümünü özelleştirin.</p>
      </div>

      <Card className="bg-card border-border shadow-sm">
        <CardContent className="space-y-6 pt-6">
          
          {/* TEMA SIFIRLAMA */}
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div className="select-none pointer-events-none">
              <p className="text-sm font-medium">Varsayılan Tema</p>
              <p className="text-xs text-muted-foreground">Ayarları sıfırlayın.</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setTheme("system")}
              style={{ cursor: 'pointer' }}
            >
              Sıfırla
            </Button>
          </div>

          {/* MOD SEÇİMİ (Sorunu Kökten Çözen Yeni Yapı) */}
          <div className="flex items-center justify-between">
            <div className="select-none pointer-events-none">
              <p className="text-sm font-medium">Görünüm Modu</p>
            </div>
            
            {/* DropdownMenu kullanarak tarayıcının o bozuk select kutusundan kurtuluyoruz */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-48 justify-between"
                  style={{ cursor: 'pointer' }}
                >
                  {modeLabels[mode]}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => setTheme("light")}
                  className="justify-between"
                >
                  Açık {mode === "light" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => setTheme("dark")}
                  className="justify-between"
                >
                  Koyu {mode === "dark" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => setTheme("system")}
                  className="justify-between"
                >
                  Sistem {mode === "system" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}