import { UserList } from "@/features/users/user-list";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch Users
  // Profiles are viewable by authenticated users (RLS), but let's see if we need special handling.
  // Our RLS: "Profiles viewable by everyone" (Authenticated)

  const { data: users } = await supabase
    .from("profiles")
    .select(
      `
      id,
      email,
      full_name,
      role,
      property:properties(name)
    `,
    )
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage users and permissions
        </p>
      </div>

      <UserList users={users || []} />
    </div>
  );
}
