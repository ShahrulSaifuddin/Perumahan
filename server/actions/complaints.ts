"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserProfile } from "@/lib/api/users";

const complaintSchema = z.object({
  title: z.string().min(5, "Title too short"),
  description: z.string().min(10, "Description too short"),
  category: z.string().min(1, "Category required"),
});

export async function createComplaint(propertyId: string, formData: FormData) {
  const user = await getCurrentUserProfile();
  if (!user) return { success: false, message: "Unauthorized" };

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
  };

  const result = complaintSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: result.error.flatten(),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("complaints").insert({
    property_id: propertyId,
    user_id: user.id,
    title: result.data.title,
    description: result.data.description,
    category: result.data.category,
    status: "OPEN",
  });

  if (error) {
    console.error("Create complaint error:", error);
    return { success: false, message: "Failed to submit complaint" };
  }

  revalidatePath("/complaints");
  return { success: true, message: "Complaint submitted successfully" };
}

export async function updateComplaintStatus(
  complaintId: string,
  status: string,
) {
  const user = await getCurrentUserProfile();
  if (!user) return { success: false, message: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("complaints")
    .update({ status })
    .eq("id", complaintId);

  if (error) {
    console.error("Update status error:", error);
    return { success: false, message: "Failed to update status" };
  }

  revalidatePath(`/complaints/${complaintId}`);
  revalidatePath("/complaints");
  return { success: true, message: "Status updated" };
}

export async function addComment(complaintId: string, comment: string) {
  const user = await getCurrentUserProfile();
  if (!user) return { success: false, message: "Unauthorized" };

  if (!comment.trim())
    return { success: false, message: "Comment cannot be empty" };

  const supabase = await createClient();
  const { error } = await supabase.from("complaint_comments").insert({
    complaint_id: complaintId,
    user_id: user.id,
    comment: comment,
  });

  if (error) {
    console.error("Add comment error:", error);
    return { success: false, message: "Failed to post comment" };
  }

  revalidatePath(`/complaints/${complaintId}`);
  return { success: true, message: "Comment posted" };
}
