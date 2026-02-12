import { TableSkeleton } from "@/components/skeletons";

export default function ComplaintsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-4 mb-6">
        <div className="h-10 w-48 bg-muted rounded-md animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
      </div>

      <TableSkeleton rowCount={10} showActions />
    </div>
  );
}
