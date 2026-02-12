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
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Properties",
    icon: Building2,
    href: "/properties",
    color: "text-violet-500",
  },
  {
    label: "Finance",
    icon: BarChart3,
    href: "/finance",
    color: "text-pink-700",
  },
  {
    label: "Complaints",
    icon: MessageSquare,
    href: "/complaints",
    color: "text-orange-700",
  },
  {
    label: "Reports",
    icon: FileText,
    href: "/reports",
    color: "text-emerald-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-100/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
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
                pathname === route.href
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
    </div>
  );
}
