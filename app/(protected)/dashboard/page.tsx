import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsCards } from "@/features/dashboard/stats-cards";
import { DashboardCharts } from "@/features/dashboard/charts";
import { getDashboardStats, getComplaintTrends } from "@/lib/api/dashboard";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch data in parallel
  const [stats, trends] = await Promise.all([
    getDashboardStats(),
    getComplaintTrends(),
  ]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of community complaints and finances.
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <StatsCards stats={stats} />
        <DashboardCharts
          trends={trends}
          finance={{
            totalSpent: stats.finance.totalSpent,
            remaining: stats.finance.remaining,
          }}
        />
      </Suspense>

      {/* Quick Links or Recent Activity could go here */}
      <div className="clay-card p-6 mt-8 bg-blue-50/50 border-blue-100 dark:bg-zinc-900 dark:border-zinc-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
          Welcome back!
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
          You are logged in as {user.email}. Check the sidebar for Complaints
          and Finance management.
        </p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );
}
