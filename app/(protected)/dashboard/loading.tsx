import { DashboardSkeleton } from "@/components/skeletons";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-6 max-w-7xl animate-in fade-in duration-500">
      <DashboardSkeleton />
    </div>
  );
}
