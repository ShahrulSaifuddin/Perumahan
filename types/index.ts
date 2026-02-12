export interface Transaction {
  id: string;
  property_id: string;
  type: "IN" | "OUT";
  amount: number;
  description: string;
  category: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  transaction_date: string;
  created_by: string;
  approved_by?: string;
  attachment_path?: string;
  created_at: string;
}
