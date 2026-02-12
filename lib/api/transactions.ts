import { createClient } from "@/lib/supabase/server";

export async function getTransactions(
  propertyId: string,
  filters?: { status?: string; year?: number },
) {
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select(
      `
      *,
      creator:created_by(full_name),
      approver:approved_by(full_name)
    `,
    )
    .eq("property_id", propertyId)
    .order("transaction_date", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.year) {
    query = query
      .gte("transaction_date", `${filters.year}-01-01`)
      .lte("transaction_date", `${filters.year}-12-31`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data;
}
