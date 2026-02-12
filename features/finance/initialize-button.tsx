"use client";

import { useState } from "react";
import { ensureAllocation } from "@/server/actions/finance";
import { Loader2 } from "lucide-react";

interface InitializeFinanceButtonProps {
  propertyId: string;
  year: number;
}

export function InitializeFinanceButton({
  propertyId,
  year,
}: InitializeFinanceButtonProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleInit() {
    setLoading(true);
    setMsg("");
    try {
      const res = await ensureAllocation(propertyId, year);
      if (res.success) {
        setMsg("Success! Initialized.");
      } else {
        setMsg(res.message || "Failed to initialize.");
      }
    } catch (e) {
      setMsg("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleInit}
        disabled={loading}
        className="clay-btn bg-primary text-primary-foreground px-6 py-3 font-semibold disabled:opacity-50 flex items-center gap-2"
      >
        {loading && <Loader2 className="animate-spin h-4 w-4" />}
        Initialize Allocation (RM 5,000)
      </button>
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
    </div>
  );
}
