"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function ensureAllocation(propertyId: string, year: number) {
  const supabase = await createClient();

  // Check if exists
  const { data: existing } = await supabase
    .from("finance_allocations")
    .select("id")
    .eq("property_id", propertyId)
    .eq("year", year)
    .single();

  if (existing) {
    return { success: true, message: "Allocation already exists" };
  }

  // Create default allocation (RM 5,000)
  const { error } = await supabase.from("finance_allocations").insert({
    property_id: propertyId,
    year: year,
    amount: 5000.0,
  });

  if (error) {
    console.error("Error creating allocation:", error);
    return { success: false, message: "Failed to create allocation" };
  }

  revalidatePath("/finance");
  return { success: true, message: "Allocation created successfully" };
}
