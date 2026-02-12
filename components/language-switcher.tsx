"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ms" : "en";
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex w-full items-center justify-start rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-slate-200/50 hover:text-primary dark:hover:bg-slate-800/50"
    >
      <span className="mr-2">{locale === "en" ? "🇲🇾" : "🇺🇸"}</span>
      {locale === "en" ? "Bahasa Malaysia" : "English"}
    </button>
  );
}
