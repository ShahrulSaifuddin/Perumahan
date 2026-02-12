"use client";

import { useState } from "react";
import { updateComplaintStatus } from "@/server/actions/complaints";
import { Loader2 } from "lucide-react";

interface StatusSelectProps {
  id: string;
  currentStatus: string;
  canEdit: boolean;
}

export function StatusSelect({
  id,
  currentStatus,
  canEdit,
}: StatusSelectProps) {
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!canEdit) return;
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setLoading(true);
    try {
      await updateComplaintStatus(id, newStatus);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={!canEdit || loading}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="OPEN">Open</option>
        <option value="IN_REVIEW">In Review</option>
        <option value="ACTIONED">Actioned</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
