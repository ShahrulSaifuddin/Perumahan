"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  const routes = [
    {
      label: t("dashboard"),
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Properties", // Missing translation key, fallback to English for now or add to JSON
      icon: Building2,
      href: "/properties",
      color: "text-violet-500",
    },
    {
      label: t("finance"),
      icon: BarChart3,
      href: "/finance",
      color: "text-pink-700",
    },
    {
      label: t("complaints"),
      icon: MessageSquare,
      href: "/complaints",
      color: "text-orange-700",
    },
    {
      label: "Reports", // Missing translation key
      icon: FileText,
      href: "/reports",
      color: "text-emerald-500",
    },
    {
      label: t("users"), // Was Settings, but href is /settings/users, assuming "Users" is better context or "Settings"
      icon: Settings,
      href: "/settings/users",
    },
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-100/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Home className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Perumahan</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200",
                pathname === route.href || pathname.startsWith(route.href)
                  ? "bg-white/80 dark:bg-slate-800 text-primary clay-card border-0"
                  : "text-muted-foreground",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 space-y-2">
        <LanguageSwitcher />
        <form action="/auth/signout" method="post">
          <button
            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            type="submit"
          >
            <div className="flex items-center flex-1">
              <LogOut className="h-5 w-5 mr-3" />
              {t("logout")}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
