import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/api/users";

export interface DashboardStats {
  complaints: {
    total: number;
    open: number;
    resolved: number;
  };
  finance: {
    totalAllocated: number;
    totalSpent: number;
    remaining: number;
    pendingMyApprovals: number;
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const user = await getCurrentUserProfile();

  if (!user) {
    return {
      complaints: { total: 0, open: 0, resolved: 0 },
      finance: {
        totalAllocated: 0,
        totalSpent: 0,
        remaining: 0,
        pendingMyApprovals: 0,
      },
    };
  }

  // Determine filtering
  // If DBKL (Super Admin or Officer), show ALL data.
  // If Leader, Finance, or Resident, show ONLY their Property data.
  const isDBKL = user.role.startsWith("DBKL");
  const propertyId = user.property_id;

  // 1. Complaints Stats
  let complaintsQuery = supabase
    .from("complaints")
    .select("*", { count: "exact", head: true });
  if (!isDBKL && propertyId) {
    complaintsQuery = complaintsQuery.eq("property_id", propertyId);
  }
  const { count: totalComplaints } = await complaintsQuery;

  // Open
  let openQuery = supabase
    .from("complaints")
    .select("*", { count: "exact", head: true })
    .in("status", ["OPEN", "IN_REVIEW"]);
  if (!isDBKL && propertyId) {
    openQuery = openQuery.eq("property_id", propertyId);
  }
  const { count: openComplaints } = await openQuery;

  // Resolved
  let resolvedQuery = supabase
    .from("complaints")
    .select("*", { count: "exact", head: true })
    .in("status", ["RESOLVED", "CLOSED"]);
  if (!isDBKL && propertyId) {
    resolvedQuery = resolvedQuery.eq("property_id", propertyId);
  }
  const { count: resolvedComplaints } = await resolvedQuery;

  // 2. Finance Stats
  let allocationsQuery = supabase.from("finance_allocations").select("amount");
  if (!isDBKL && propertyId) {
    allocationsQuery = allocationsQuery.eq("property_id", propertyId);
  }
  const { data: allocations } = await allocationsQuery;
  const totalAllocated =
    allocations?.reduce((sum, a) => sum + Number(a.amount), 0) || 0;

  // Spent
  let transactionsQuery = supabase
    .from("transactions")
    .select("amount")
    .eq("type", "OUT")
    .eq("status", "APPROVED");
  if (!isDBKL && propertyId) {
    transactionsQuery = transactionsQuery.eq("property_id", propertyId);
  }
  const { data: transactions } = await transactionsQuery;
  const totalSpent =
    transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  // 3. Pending Approvals
  // For Residents: They don't approve anything, so 0? Or maybe show "My Pending Requests"?
  // For Leaders: Show SUBMITTED transactions for their property.
  // For DBKL: Show nothing unless there's a flow for them (currently Leader approves).

  let pendingApprovals = 0;

  if (user.role === "FLAT_LEADER" && propertyId) {
    const { count } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("property_id", propertyId)
      .eq("status", "SUBMITTED");
    pendingApprovals = count || 0;
  } else if (user.role === "FINANCE_OFFICER" && propertyId) {
    // Finance officer creates requests, maybe show Drafts?
    const { count } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("property_id", propertyId)
      .eq("status", "DRAFT");
    pendingApprovals = count || 0;
  }

  return {
    complaints: {
      total: totalComplaints || 0,
      open: openComplaints || 0,
      resolved: resolvedComplaints || 0,
    },
    finance: {
      totalAllocated,
      totalSpent,
      remaining: totalAllocated - totalSpent,
      pendingMyApprovals: pendingApprovals,
    },
  };
}

export async function getComplaintTrends() {
  const supabase = await createClient();
  const user = await getCurrentUserProfile();

  if (!user) return [];

  const isDBKL = user.role.startsWith("DBKL");
  const propertyId = user.property_id;

  let query = supabase
    .from("complaints")
    .select("created_at")
    .gte(
      "created_at",
      new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
    );

  if (!isDBKL && propertyId) {
    query = query.eq("property_id", propertyId);
  }

  const { data: complaints } = await query;

  // Aggregate by month
  const trends: Record<string, number> = {};
  complaints?.forEach((c) => {
    const date = new Date(c.created_at);
    // Use proper locale
    const month = date.toLocaleString("default", { month: "short" });
    trends[month] = (trends[month] || 0) + 1;
  });

  // Sort by time?
  // Current object keys order isn't guaranteed chronologically
  // Let's ensure last 6 months order
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.toLocaleString("default", { month: "short" });
    result.push({
      name: month,
      count: trends[month] || 0,
    });
  }

  return result;
}
