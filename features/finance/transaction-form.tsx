"use client";

import { useState } from "react";
import { createTransaction } from "@/server/actions/transactions";
import { Loader2 } from "lucide-react";

interface TransactionFormProps {
  propertyId: string;
  onSuccess?: () => void;
}

export function TransactionForm({
  propertyId,
  onSuccess,
}: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMsg("");

    try {
      const res = await createTransaction(propertyId, formData);
      if (res.success) {
        setMsg("Transaction created!");
        // Reset form?
        if (onSuccess) onSuccess();
      } else {
        setMsg(res.message || "Failed");
      }
    } catch {
      setMsg("Error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <select
            name="type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="OUT">Expense (OUT)</option>
            <option value="IN">Income (IN)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount (RM)</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <input
          name="transaction_date"
          type="date"
          required
          defaultValue={new Date().toISOString().split("T")[0]}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <input
          name="category"
          type="text"
          placeholder="e.g. Maintenance, Utility"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          required
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {msg && (
        <p
          className={
            msg.includes("Failed") || msg.includes("Error")
              ? "text-destructive"
              : "text-emerald-600"
          }
        >
          {msg}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="clay-btn bg-primary text-primary-foreground px-4 py-2 w-full flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="animate-spin h-4 w-4" />}
        Create Transaction
      </button>
    </form>
  );
}
