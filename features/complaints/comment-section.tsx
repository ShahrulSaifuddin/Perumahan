"use client";

import { useState } from "react";
import { addComment } from "@/server/actions/complaints";
import { Comment } from "@/lib/api/complaints";
import { format } from "date-fns";
import { Loader2, Send } from "lucide-react";

interface CommentSectionProps {
  complaintId: string;
  comments: Comment[];
}

export function CommentSection({ complaintId, comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await addComment(complaintId, newComment);
      setNewComment("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-lg font-semibold">Comments & History</h3>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-muted/30 p-4 rounded-lg space-y-2"
          >
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {comment.author?.full_name || "Unknown User"}
              </span>
              <span>
                {format(new Date(comment.created_at), "dd MMM yyyy, HH:mm")}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            No comments yet.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 items-start">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="bg-primary text-primary-foreground p-3 rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
}
