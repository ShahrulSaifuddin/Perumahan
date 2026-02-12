import { Metadata } from "next";
import { getFinanceOverview } from "@/lib/api/finance";
import { getCurrentUserProfile } from "@/lib/api/users";
import { AllocationCard } from "@/components/finance/allocation-card";
import { InitializeFinanceButton } from "@/features/finance/initialize-button";
import { DownloadReportButton } from "@/features/finance/download-report-button";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Finance Dashboard | DBKL Flat Management",
  description: "View and manage property finances",
};

export default async function FinancePage() {
  const user = await getCurrentUserProfile();

  if (!user) {
    redirect("/auth/login");
  }

  // HACK for MVP: If super admin, stick to the seed property ID for demo.
  const targetPropertyId =
    user.property_id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"; // Seed ID

  const currentYear = new Date().getFullYear();
  const overview = await getFinanceOverview(targetPropertyId, currentYear);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Finance Dashboard
          </h1>
          <p className="text-muted-foreground">
            Financial overview for {currentYear}.
          </p>
        </div>
        <DownloadReportButton year={currentYear} />
      </div>

      {!overview.exists ? (
        <div className="clay-card p-8 text-center space-y-4">
          <h2 className="text-xl font-semibold">No Allocation Record Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            There is no finance record for {currentYear}. Initialize the annual
            allocation to start tracking expenses.
          </p>
          <InitializeFinanceButton
            propertyId={targetPropertyId}
            year={currentYear}
          />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AllocationCard overview={overview} className="col-span-2" />

          {/* Placeholder for future widgets */}
          <div className="clay-card p-6 flex items-center justify-center text-muted-foreground border-dashed border-2">
            Transaction Summary will appear here in future updates.
          </div>
        </div>
      )}
    </div>
  );
}
