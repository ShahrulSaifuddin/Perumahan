import { Metadata } from "next";
import { getCurrentUserProfile } from "@/lib/api/users";
import { ComplaintForm } from "@/features/complaints/complaint-form";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "New Complaint | DBKL Flat Management",
  description: "Submit a new complaint",
};

export default async function NewComplaintPage() {
  const user = await getCurrentUserProfile();
  if (!user) redirect("/auth/login");

  const targetPropertyId =
    user.property_id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Complaint</h1>
        <p className="text-muted-foreground">
          Describe the issue you are facing.
        </p>
      </div>

      <div className="clay-card p-6">
        <ComplaintForm propertyId={targetPropertyId} />
      </div>
    </div>
  );
}
