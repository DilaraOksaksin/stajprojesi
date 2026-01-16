"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-2 h-9 w-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center rounded-full bg-white/10 p-2 shadow-sm transition-all hover:bg-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 light:bg-gray-100 light:text-gray-900 light:hover:bg-gray-200 cursor-pointer"
      type="button"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}