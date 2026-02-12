"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const propertySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  address: z.string().optional(),
});

export type PropertyFormState = {
  errors?: {
    name?: string[];
    address?: string[];
    _form?: string[];
  };
  message?: string;
};

async function checkSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "DBKL_SUPER_ADMIN";
}

export async function createProperty(
  prevState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const isSuperAdmin = await checkSuperAdmin();
  if (!isSuperAdmin) {
    return {
      message: "Unauthorized: Only Super Admins can create properties.",
    };
  }

  const validatedFields = propertySchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("properties").insert({
    name: validatedFields.data.name,
    address: validatedFields.data.address,
  });

  if (error) {
    return {
      message: "Database Error: Failed to create property.",
    };
  }

  revalidatePath("/settings/properties");
  return { message: "Property created successfully!" };
}

export async function updateProperty(
  id: string,
  prevState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const isSuperAdmin = await checkSuperAdmin();
  if (!isSuperAdmin) {
    return {
      message: "Unauthorized: Only Super Admins can update properties.",
    };
  }

  const validatedFields = propertySchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("properties")
    .update({
      name: validatedFields.data.name,
      address: validatedFields.data.address,
    })
    .eq("id", id);

  if (error) {
    return {
      message: "Database Error: Failed to update property.",
    };
  }

  revalidatePath("/settings/properties");
  return { message: "Property updated successfully!" };
}

export async function deleteProperty(id: string) {
  const isSuperAdmin = await checkSuperAdmin();
  if (!isSuperAdmin) {
    return {
      message: "Unauthorized: Only Super Admins can delete properties.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    return { message: "Database Error: Failed to delete property." };
  }

  revalidatePath("/settings/properties");
  return { message: "Property deleted successfully!" };
}
