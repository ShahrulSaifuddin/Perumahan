import { createClient } from "@/lib/supabase/server";

export interface Complaint {
  id: string;
  property_id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: "OPEN" | "IN_REVIEW" | "ACTIONED" | "RESOLVED" | "CLOSED";
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    email: string;
  };
  sla_due_at?: string;
}

export interface Comment {
  id: string;
  complaint_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  author?: {
    full_name: string;
    email: string;
  };
}

export interface ComplaintDetails extends Complaint {
  comments: Comment[];
}

export async function getComplaints(
  propertyId: string,
  filters?: { status?: string; mineOnly?: boolean },
) {
  const supabase = await createClient();

  let query = supabase
    .from("complaints")
    .select(
      `
      *,
      author:user_id(full_name, email)
    `,
    )
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.mineOnly) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      query = query.eq("user_id", user.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching complaints:", error);
    return [];
  }

  return data as Complaint[];
}

export async function getComplaintDetails(id: string) {
  const supabase = await createClient();

  // Fetch complaint
  const { data: complaint, error: complaintError } = await supabase
    .from("complaints")
    .select(
      `
      *,
      author:user_id(full_name, email)
    `,
    )
    .eq("id", id)
    .single();

  if (complaintError || !complaint) return null;

  // Fetch comments
  const { data: comments, error: commentsError } = await supabase
    .from("complaint_comments")
    .select(
      `
      *,
      author:user_id(full_name, email)
    `,
    )
    .eq("complaint_id", id)
    .order("created_at", { ascending: true });

  if (commentsError) console.error("Error fetching comments:", commentsError);

  return {
    ...complaint,
    comments: comments || [],
  } as ComplaintDetails;
}
