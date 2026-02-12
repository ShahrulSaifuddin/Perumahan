import { Metadata } from "next";
import { getComplaintDetails } from "@/lib/api/complaints";
import { getCurrentUserProfile } from "@/lib/api/users";
import { ComplaintDetailsView } from "@/features/complaints/complaint-details";
import { redirect, notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Complaint Details | DBKL Flat Management",
};

interface PageProps {
  params: { id: string };
}

export default async function ComplaintPage({ params }: PageProps) {
  const user = await getCurrentUserProfile();
  if (!user) redirect("/auth/login");

  const complaint = await getComplaintDetails(params.id);

  if (!complaint) {
    notFound();
  }

  // Basic RLS should handle visibility, but explicit check:
  // - If Resident: Must be own complaint.
  // - If DBKL/Leader: Must be authorized for property.
  // For MVP we rely on getComplaintDetails logic (which relies on DB).
  // If getComplaintDetails returns null (due to RLS or not found), we 404.

  return (
    <div className="max-w-4xl mx-auto">
      <ComplaintDetailsView complaint={complaint} currentUserRole={user.role} />
    </div>
  );
}
