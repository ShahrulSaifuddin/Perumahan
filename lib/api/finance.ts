import { createClient } from "@/lib/supabase/server";

export interface FinanceOverview {
  allocation: number;
  spent: number;
  balance: number;
  year: number;
  exists: boolean;
}

export async function getFinanceOverview(
  propertyId: string,
  year: number,
): Promise<FinanceOverview> {
  const supabase = await createClient();

  // 1. Get Allocation
  const { data: allocationData, error: allocationError } = await supabase
    .from("finance_allocations")
    .select("amount")
    .eq("property_id", propertyId)
    .eq("year", year)
    .single();

  if (allocationError && allocationError.code !== "PGRST116") {
    // PGRST116 is "not found"
    console.error("Error fetching allocation:", allocationError);
  }

  const allocationAmount = allocationData?.amount || 0;
  const exists = !!allocationData;

  // 2. Get Approved Expenses (Transactions OUT + APPROVED)
  const { data: expensesData, error: expensesError } = await supabase
    .from("transactions")
    .select("amount")
    .eq("property_id", propertyId)
    .eq("type", "OUT")
    .eq("status", "APPROVED")
    // Filter by year? Transactions have full date.
    // Assuming we filter by transaction_date within the year.
    .gte("transaction_date", `${year}-01-01`)
    .lte("transaction_date", `${year}-12-31`);

  if (expensesError) {
    console.error("Error fetching expenses:", expensesError);
  }

  const spent =
    expensesData?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;

  // 3. Get Income (Transactions IN + APPROVED) - Optional if we consider income adding to balance
  // For now, let's assume Balance = Allocation - Spent + Income?
  // SPEC says: Balance = allocation - sum(OUT approved) + sum(IN approved if used)

  const { data: incomeData } = await supabase
    .from("transactions")
    .select("amount")
    .eq("property_id", propertyId)
    .eq("type", "IN")
    .eq("status", "APPROVED")
    .gte("transaction_date", `${year}-01-01`)
    .lte("transaction_date", `${year}-12-31`);

  const income =
    incomeData?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;

  const balance = allocationAmount - spent + income;

  return {
    allocation: allocationAmount,
    spent,
    balance,
    year,
    exists,
  };
}
