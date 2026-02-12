import { UserForm } from "@/features/users/user-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewUserPage() {
  const supabase = await createClient();

  // Fetch properties for the dropdown
  const { data: properties } = await supabase
    .from("properties")
    .select("id, name")
    .order("name");

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Link
        href="/settings/users"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Link>

      <div className="clay-card p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Create New User
        </h1>
        <UserForm properties={properties || []} />
      </div>
    </div>
  );
}
