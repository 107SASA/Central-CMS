import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateApiKey } from "@/lib/api-auth";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ websiteSlug: string }> }
) {
  const { websiteSlug } = await params;
  const { valid, websiteId, error } = await validateApiKey(request, websiteSlug);

  if (!valid) return error!;

  const supabase = getServiceClient();

  const { data: pages, error: dbError } = await supabase
    .from("pages")
    .select("id, title, slug, meta_title, meta_description, og_image, status, updated_at")
    .eq("website_id", websiteId!)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (dbError) {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }

  return NextResponse.json(
    { data: pages },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "s-maxage=60, stale-while-revalidate",
      },
    }
  );
}
