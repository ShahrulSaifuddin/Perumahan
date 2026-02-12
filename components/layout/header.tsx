"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-16 w-full flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-x-4">
        <MobileSidebar />
        <div className="font-semibold text-lg hidden md:block">
          DBKL Flat Management
        </div>
        <div className="font-semibold text-lg md:hidden">DBKL</div>
      </div>
      <div className="flex items-center gap-x-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-5.5 right-6 text-slate-100" />
          <span className="sr-only">Toggle theme</span>
        </button>

        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <span className="text-xs font-semibold">U</span>
        </div>
      </div>
    </div>
  );
}
