import { differenceInDays, formatDistanceToNow, isPast } from "date-fns";

export function SLABadge({ dueAt }: { dueAt: string }) {
  const date = new Date(dueAt);
  const isOverdue = isPast(date);
  const daysLeft = differenceInDays(date, new Date());

  // Logic:
  // Overdue -> Red
  // Due today/tomorrow -> Orange
  // Else -> Gray

  if (isOverdue) {
    return (
      <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded font-medium border border-destructive/20">
        Overdue {formatDistanceToNow(date)}
      </span>
    );
  }

  if (daysLeft <= 1) {
    return (
      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded font-medium border border-orange-200">
        Due soon ({daysLeft === 0 ? "Today" : "Tomorrow"})
      </span>
    );
  }

  return (
    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded font-medium border border-gray-200">
      Due in {daysLeft} days
    </span>
  );
}
