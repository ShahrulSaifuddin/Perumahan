"use client";

import { format } from "date-fns";
import Link from "next/link";
import { StatusBadge } from "./status-badge";
import { Complaint } from "@/lib/api/complaints";

interface ComplaintListProps {
  complaints: Complaint[];
}

export function ComplaintList({ complaints }: ComplaintListProps) {
  if (!complaints.length) {
    return (
      <div className="text-center p-8 text-muted-foreground border-dashed border-2 rounded-lg">
        No complaints found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <Link
          href={`/complaints/${complaint.id}`}
          key={complaint.id}
          className="block clay-card p-4 hover:translate-y-[-2px] transition-transform"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{complaint.title}</h3>
              <p className="text-xs text-muted-foreground">
                {format(new Date(complaint.created_at), "dd MMM yyyy, HH:mm")} •
                by {complaint.author?.full_name || "Unknown"}
              </p>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {complaint.description}
          </p>
          <div className="mt-3 flex gap-2">
            <span className="text-xs px-2 py-1 bg-secondary rounded text-secondary-foreground">
              {complaint.category}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
