import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role to bypass RLS — public API endpoints have no user session
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function validateApiKey(
  request: NextRequest,
  websiteSlug: string
): Promise<{ valid: boolean; websiteId?: string; error?: NextResponse }> {
  const supabase = getServiceClient();

  const { data: website } = await supabase
    .from("websites")
    .select("id, api_key")
    .eq("slug", websiteSlug)
    .single();

  if (!website) {
    return {
      valid: false,
      error: NextResponse.json({ error: "Website not found" }, { status: 404 }),
    };
  }

  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    return {
      valid: false,
      error: NextResponse.json(
        { error: "Missing x-api-key header" },
        { status: 401 }
      ),
    };
  }

  if (apiKey !== website.api_key) {
    return {
      valid: false,
      error: NextResponse.json({ error: "Invalid API key" }, { status: 401 }),
    };
  }

  return { valid: true, websiteId: website.id };
}
