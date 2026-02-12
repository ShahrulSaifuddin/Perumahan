import { Metadata } from "next";
import { getComplaints } from "@/lib/api/complaints";
import { getCurrentUserProfile } from "@/lib/api/users";
import { ComplaintList } from "@/features/complaints/complaint-list";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Complaints | DBKL Flat Management",
  description: "View and submit complaints",
};

export default async function ComplaintsPage() {
  const user = await getCurrentUserProfile();
  if (!user) redirect("/auth/login");

  const targetPropertyId =
    user.property_id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  // DBKL sees all? For now, fetch by property ID mostly.
  // If DBKL admin, they might want to see all or filter.
  // For MVP, let's show complaints for the current property context.

  const complaints = await getComplaints(targetPropertyId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>
          <p className="text-muted-foreground">
            Report issues and track status.
          </p>
        </div>
        <Link
          href="/complaints/new"
          className="clay-btn bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2 font-medium"
        >
          <Plus className="h-4 w-4" />
          New Complaint
        </Link>
      </div>

      <ComplaintList complaints={complaints || []} />
    </div>
  );
}
