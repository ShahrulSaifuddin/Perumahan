import { createClient } from "@/lib/supabase/server";

export async function getProperties() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  return data;
}

export async function getPropertyById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching property ${id}:`, error);
    return null;
  }

  return data;
}
