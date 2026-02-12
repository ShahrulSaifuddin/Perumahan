"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server"; // For auth check
import { getCurrentUserProfile } from "@/lib/api/users";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.enum([
    "DBKL_SUPER_ADMIN",
    "DBKL_OFFICER",
    "FLAT_LEADER",
    "FINANCE_OFFICER",
    "RESIDENT",
  ]),
  propertyId: z.string().optional(),
  password: z.string().min(6), // Admin sets initial password
});

export async function createUser(formData: FormData) {
  // 1. Authorization Check
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) return { success: false, message: "Unauthorized" };

  const allowedRoles = ["DBKL_SUPER_ADMIN", "DBKL_OFFICER", "FLAT_LEADER"];
  if (!allowedRoles.includes(currentUser.role)) {
    return { success: false, message: "Insufficient permissions" };
  }

  // TODO: Add stricter permission checks (e.g., Flat Leader can only create for their property)
  // implementation_plan.md says:
  // - DBKL_SUPER_ADMIN: Any
  // - DBKL_OFFICER: Flat Leaders/Residents
  // - FLAT_LEADER: Residents/Finance for their property

  const rawData = {
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
    propertyId: formData.get("propertyId") || null, // Convert empty string to null
    password: formData.get("password"),
  };

  const result = createUserSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: result.error.flatten(),
    };
  }

  const { email, fullName, role, propertyId, password } = result.data;

  // 2. Logic: Create User in Auth (Admin Client)
  const supabaseAdmin = createAdminClient();

  // Note: signUp vs createUser. createUser is admin-only and auto-confirms email if configured.
  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  if (authError) {
    console.error("Auth creation failed:", authError);
    return { success: false, message: authError.message };
  }

  if (!authUser.user) {
    return { success: false, message: "Failed to create user object" };
  }

  // 3. Logic: Insert into Profiles (Public Schema)
  // We use supabaseAdmin here too because RLS might block inserting OTHER users' profiles unless we are Super Admin.
  // Although our RLS allows specific roles, admin client is safer for "system" actions.
  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: authUser.user.id,
    email,
    full_name: fullName,
    role,
    property_id: propertyId || null,
  });

  if (profileError) {
    console.error("Profile creation failed:", profileError);
    // Rollback? Deleting auth user is tricky but good practice.
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return { success: false, message: "Failed to create user profile" };
  }

  revalidatePath("/settings/users");
  return { success: true, message: "User created successfully" };
}
