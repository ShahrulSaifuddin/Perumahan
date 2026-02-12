"use client";

import { FinanceOverview } from "@/lib/api/finance";
import { cn } from "@/lib/utils";
// import { Progress } from "@/components/ui/progress" // We don't have shadcn progress installed yet.
// Implementing simple progress bar.

interface AllocationCardProps {
  overview: FinanceOverview;
  className?: string;
}

export function AllocationCard({ overview, className }: AllocationCardProps) {
  const percentSpent =
    overview.allocation > 0
      ? Math.min(100, Math.round((overview.spent / overview.allocation) * 100))
      : 0;

  return (
    <div className={cn("clay-card p-6 space-y-4", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-muted-foreground">
            Annual Allocation ({overview.year})
          </h3>
          <div className="text-3xl font-bold mt-2">
            RM{" "}
            {overview.allocation.toLocaleString("en-MY", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Balance</div>
          <div
            className={cn(
              "text-xl font-bold",
              overview.balance < 0 ? "text-destructive" : "text-emerald-600",
            )}
          >
            RM{" "}
            {overview.balance.toLocaleString("en-MY", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Spent: RM{" "}
            {overview.spent.toLocaleString("en-MY", {
              minimumFractionDigits: 2,
            })}
          </span>
          <span>{percentSpent}%</span>
        </div>

        {/* Simple Progress Bar */}
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${percentSpent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
