"use client";

import { useState } from "react";
import {
  approveTransaction,
  rejectTransaction,
} from "@/server/actions/transactions";
import { Loader2, Check, X } from "lucide-react";

interface ApprovalButtonsProps {
  transactionId: string;
}

export function ApprovalButtons({ transactionId }: ApprovalButtonsProps) {
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    if (!confirm("Approve this transaction? This will impact the balance."))
      return;
    setLoading(true);
    try {
      await approveTransaction(transactionId);
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!confirm("Reject this transaction?")) return;
    setLoading(true);
    try {
      await rejectTransaction(transactionId);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={loading}
        title="Approve"
        className="p-1 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </button>
      <button
        onClick={handleReject}
        disabled={loading}
        title="Reject"
        className="p-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <X className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
