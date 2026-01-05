"use client";

import { Languages } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/app/components/ui/radio-group";

export default function LanguageSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Languages className="size-5 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Dil Ayarları</h1>
      </div>

      <RadioGroup defaultValue="tr" className="space-y-3">
        <label className="flex items-center gap-3 rounded-md border border-border p-3">
          <RadioGroupItem value="tr" />
          <span className="text-sm font-medium">🇹🇷 Türkçe</span>
        </label>
        <label className="flex items-center gap-3 rounded-md border border-border p-3">
          <RadioGroupItem value="en" />
          <span className="text-sm font-medium">🇺🇸 English</span>
        </label>
      </RadioGroup>

      <Button>Değişiklikleri Kaydet</Button>
    </div>
  );
}
