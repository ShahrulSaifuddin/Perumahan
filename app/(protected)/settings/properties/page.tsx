import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PropertyList } from "@/features/settings/properties/property-list";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const supabase = await createClient();

  // Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch Profile for Role Check
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isSuperAdmin = profile?.role === "DBKL_SUPER_ADMIN";

  // Fetch Properties
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Properties</h3>
        <p className="text-sm text-muted-foreground">
          Manage the list of flats and apartments under DBKL.
        </p>
      </div>
      <Separator />

      {!isSuperAdmin && (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md">
          You do not have permission to modify properties. Only Super Admins can
          add or edit.
        </div>
      )}

      <PropertyList properties={properties || []} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
