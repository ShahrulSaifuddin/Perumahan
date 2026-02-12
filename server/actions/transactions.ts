"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserProfile } from "@/lib/api/users";

const transactionSchema = z.object({
  type: z.enum(["IN", "OUT"]),
  amount: z.coerce.number().positive(),
  description: z.string().min(3),
  category: z.string().min(2),
  transaction_date: z.string(), // YYYY-MM-DD
  attachment_path: z.string().optional(),
});

export async function createTransaction(
  propertyId: string,
  formData: FormData,
) {
  const user = await getCurrentUserProfile();
  if (!user) return { success: false, message: "Unauthorized" };

  // Role check: FINANCE_OFFICER (or Admin)
  if (!["FINANCE_OFFICER", "DBKL_SUPER_ADMIN"].includes(user.role)) {
    return {
      success: false,
      message: "Only Finance Officers can create transactions.",
    };
  }

  const rawData = {
    type: formData.get("type"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    category: formData.get("category"),
    transaction_date: formData.get("transaction_date"),
    attachment_path: formData.get("attachment_path"),
  };

  const result = transactionSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: result.error.flatten(),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("transactions").insert({
    property_id: propertyId,
    created_by: user.id,
    type: result.data.type,
    amount: result.data.amount,
    description: result.data.description,
    category: result.data.category,
    transaction_date: result.data.transaction_date,
    attachment_path: result.data.attachment_path,
    status: "DRAFT",
  });

  if (error) {
    console.error("Create transaction error:", error);
    return { success: false, message: "Database insert failed" };
  }

  revalidatePath("/finance");
  return { success: true, message: "Transaction created (Draft)" };
}

export async function submitTransaction(transactionId: string) {
  const user = await getCurrentUserProfile();
  if (!user) return { success: false, message: "Unauthorized" };

  // Check if owner or Finance Officer
  const supabase = await createClient();

  // Verify transaction exists and is DRAFT
  const { data: tx } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .single();
  if (!tx || tx.status !== "DRAFT") {
    return {
      success: false,
      message: "Transaction not found or not in Draft.",
    };
  }

  // Only creator can submit? Or any Finance Officer?
  if (tx.created_by !== user.id && user.role !== "DBKL_SUPER_ADMIN") {
    return { success: false, message: "You can only submit your own drafts." };
  }

  const { error } = await supabase
    .from("transactions")
    .update({ status: "SUBMITTED" })
    .eq("id", transactionId);

  if (error) return { success: false, message: "Update failed" };

  revalidatePath("/finance");
  return { success: true, message: "Transaction submitted for approval" };
}

export async function approveTransaction(transactionId: string) {
  const user = await getCurrentUserProfile();
  if (!user) return { success: false, message: "Unauthorized" };

  // Role: FLAT_LEADER or DBKL_SUPER_ADMIN
  if (!["FLAT_LEADER", "DBKL_SUPER_ADMIN"].includes(user.role)) {
    return { success: false, message: "Only Flat Leaders can approve." };
  }

  // TODO: Check if user belongs to same property as transaction?
  // For now assuming RLS handles visibility, but action logic should double check if strict.
  // We trust getCurrentUserProfile which gets profile from DB.

  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions")
    .update({
      status: "APPROVED",
      approved_by: user.id,
    })
    .eq("id", transactionId)
    .eq("status", "SUBMITTED"); // Must be SUBMITTED

  if (error) return { success: false, message: "Approval failed" };

  revalidatePath("/finance");
  return { success: true, message: "Transaction Approved" };
}

export async function rejectTransaction(transactionId: string) {
  const user = await getCurrentUserProfile();
  if (!user) return { success: false, message: "Unauthorized" };

  if (!["FLAT_LEADER", "DBKL_SUPER_ADMIN"].includes(user.role)) {
    return { success: false, message: "Only Flat Leaders can reject." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions")
    .update({
      status: "REJECTED",
      approved_by: user.id,
    })
    .eq("id", transactionId)
    .eq("status", "SUBMITTED");

  if (error) return { success: false, message: "Rejection failed" };

  revalidatePath("/finance");
  return { success: true, message: "Transaction Rejected" };
}

export async function deleteTransaction(transactionId: string) {
  const user = await getCurrentUserProfile();
  if (!user) return { success: false, message: "Unauthorized" };

  const supabase = await createClient();
  const { data: tx } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .single();

  if (!tx) return { success: false, message: "Not found" };

  if (tx.status !== "DRAFT" && user.role !== "DBKL_SUPER_ADMIN") {
    return { success: false, message: "Cannot delete non-draft transaction" };
  }

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId);
  if (error) return { success: false, message: "Delete failed" };

  revalidatePath("/finance");
  return { success: true, message: "Transaction deleted" };
}
