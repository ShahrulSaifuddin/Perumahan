import { TableSkeleton } from "@/components/skeletons";

export default function PropertiesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <div className="h-8 w-48 bg-muted rounded-md animate-pulse mb-2" />
        <div className="h-4 w-64 bg-muted rounded-md animate-pulse" />
      </div>
      <div className="h-px w-full bg-muted" />
      <TableSkeleton rowCount={8} showActions />
    </div>
  );
}
