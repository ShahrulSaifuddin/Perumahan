"use client";
import { useState } from "react";
import { submitTransaction } from "@/server/actions/transactions";
import { Loader2, Send } from "lucide-react";

export function SubmitButton({ transactionId }: { transactionId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!confirm("Submit for approval?")) return;
    setLoading(true);
    try {
      await submitTransaction(transactionId);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      title="Submit for Approval"
      className="text-xs flex items-center gap-1 text-slate-500 hover:text-primary disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Send className="h-3 w-3" />
      )}
      Submit
    </button>
  );
}
