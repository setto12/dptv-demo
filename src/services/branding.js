import { getServiceSupabase } from "@/lib/supabase-server";

const BRANDING_ID = "00000000-0000-0000-0000-000000000001";

export async function getBranding() {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from("branding_settings")
    .select("*")
    .eq("id", BRANDING_ID)
    .maybeSingle();

  if (error) {
    console.error("Failed to load branding:", error);
    throw error;
  }

  return (
    data ?? {
      id: BRANDING_ID,
      app_name: "Business Management",
      logo_url: null,
    }
  );
}