"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ApprovalButtons } from "./approval-buttons";
import { SubmitButton } from "./submit-button";
import { Transaction } from "@/types";

interface TransactionListProps {
  transactions: any[];
  currentUserRole: string;
}

export function TransactionList({
  transactions,
  currentUserRole,
}: TransactionListProps) {
  if (!transactions.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No transactions found.
      </div>
    );
  }

  // Cast to Transaction type for type safety in map
  const txs = transactions as Transaction[];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/50 text-muted-foreground font-medium">
          <tr>
            <th className="p-4">Date</th>
            <th className="p-4">Type</th>
            <th className="p-4">Category</th>
            <th className="p-4">Description</th>
            <th className="p-4 text-right">Amount</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {txs.map((tx) => (
            <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
              <td className="p-4">
                {format(new Date(tx.transaction_date), "dd MMM yyyy")}
              </td>
              <td className="p-4">
                <span
                  className={cn(
                    "px-2 py-1 rounded text-xs font-semibold",
                    tx.type === "IN"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700",
                  )}
                >
                  {tx.type}
                </span>
              </td>
              <td className="p-4">{tx.category}</td>
              <td className="p-4 max-w-xs truncate" title={tx.description}>
                {tx.description}
              </td>
              <td
                className={cn(
                  "p-4 text-right font-medium",
                  tx.type === "IN" ? "text-emerald-600" : "text-rose-600",
                )}
              >
                {tx.type === "IN" ? "+" : "-"} RM {Number(tx.amount).toFixed(2)}
              </td>
              <td className="p-4">
                <span
                  className={cn(
                    "px-2 py-1 rounded text-xs border",
                    tx.status === "APPROVED"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : tx.status === "REJECTED"
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : tx.status === "SUBMITTED"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-slate-200 bg-slate-50 text-slate-700",
                  )}
                >
                  {tx.status}
                </span>
              </td>
              <td className="p-4">
                {tx.status === "DRAFT" &&
                  (currentUserRole === "FINANCE_OFFICER" ||
                    currentUserRole === "DBKL_SUPER_ADMIN") && (
                    <div className="flex gap-2">
                      <SubmitButton transactionId={tx.id} />
                    </div>
                  )}
                {tx.status === "SUBMITTED" &&
                  (currentUserRole === "FLAT_LEADER" ||
                    currentUserRole === "DBKL_SUPER_ADMIN") && (
                    <ApprovalButtons transactionId={tx.id} />
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
