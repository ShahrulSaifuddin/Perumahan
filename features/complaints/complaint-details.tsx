"use client";

import { ComplaintDetails as ComplaintDetailsType } from "@/lib/api/complaints";
import { StatusBadge } from "./status-badge";
import { StatusSelect } from "./status-select";
import { CommentSection } from "./comment-section";
import { format } from "date-fns";

interface ComplaintDetailsProps {
  complaint: ComplaintDetailsType;
  currentUserRole: string;
}

export function ComplaintDetailsView({
  complaint,
  currentUserRole,
}: ComplaintDetailsProps) {
  const canEditStatus = [
    "DBKL_SUPER_ADMIN",
    "DBKL_OFFICER",
    "FLAT_LEADER",
  ].includes(currentUserRole);

  return (
    <div className="space-y-6">
      <div className="clay-card p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wide">
                {complaint.category}
              </span>
              <span className="text-xs text-muted-foreground">
                #{complaint.id.slice(0, 8)}
              </span>
            </div>
            <h1 className="text-2xl font-bold">{complaint.title}</h1>
            <p className="text-sm text-muted-foreground">
              Submitted by {complaint.author?.full_name || "Unknown"} on{" "}
              {format(new Date(complaint.created_at), "dd MMM yyyy, HH:mm")}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {canEditStatus ? (
              <StatusSelect
                id={complaint.id}
                currentStatus={complaint.status}
                canEdit={true}
              />
            ) : (
              <StatusBadge status={complaint.status} />
            )}
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none border-t pt-4">
          <p className="whitespace-pre-wrap">{complaint.description}</p>
        </div>
      </div>

      <div className="clay-card p-6">
        <CommentSection
          complaintId={complaint.id}
          comments={complaint.comments}
        />
      </div>
    </div>
  );
}
