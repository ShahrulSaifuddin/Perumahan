"use client";

import { useState } from "react";
import { createComplaint } from "@/server/actions/complaints";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ComplaintFormProps {
  propertyId: string;
}

export function ComplaintForm({ propertyId }: ComplaintFormProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMsg("");

    try {
      const res = await createComplaint(propertyId, formData);
      if (res.success) {
        setMsg("Complaint submitted!");
        router.refresh();
        router.push("/complaints");
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
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input
          name="title"
          type="text"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Brief summary of the issue"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <select
          name="category"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="Maintenance">Maintenance</option>
          <option value="Security">Security</option>
          <option value="Cleanliness">Cleanliness</option>
          <option value="Noise">Noise</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          required
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Describe the issue in detail..."
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
        Submit Complaint
      </button>
    </form>
  );
}
