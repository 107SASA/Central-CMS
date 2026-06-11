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

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const { data: blogs, error: dbError, count } = await supabase
    .from("blogs")
    .select(
      "id, title, slug, excerpt, cover_image, published_at, meta_title, meta_description, status",
      { count: "exact" }
    )
    .eq("website_id", websiteId!)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (dbError) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }

  return NextResponse.json(
    {
      data: blogs,
      meta: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "s-maxage=60, stale-while-revalidate",
      },
    }
  );
}
