"use client";

import { Download } from "lucide-react";

interface DownloadReportButtonProps {
  year: number;
}

export function DownloadReportButton({ year }: DownloadReportButtonProps) {
  return (
    <a
      href={`/finance/report?year=${year}`}
      target="_blank"
      className="clay-btn bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
    >
      <Download className="h-4 w-4" />
      Download Report
    </a>
  );
}
