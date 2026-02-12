import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-semibold border",
        status === "OPEN"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : status === "IN_REVIEW"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : status === "ACTIONED"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : status === "RESOLVED"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-700 border-slate-200", // CLOSED
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
