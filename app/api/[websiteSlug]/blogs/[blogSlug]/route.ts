import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateApiKey } from "@/lib/api-auth";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
import type { ApiBlogResponse } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ websiteSlug: string; blogSlug: string }> }
) {
  const { websiteSlug, blogSlug } = await params;
  const { valid, websiteId, error } = await validateApiKey(request, websiteSlug);

  if (!valid) return error!;

  const supabase = getServiceClient();

  const { data: blog, error: dbError } = await supabase
    .from("blogs")
    .select("*")
    .eq("website_id", websiteId!)
    .eq("slug", blogSlug)
    .eq("status", "published")
    .single();

  if (dbError || !blog) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  const response: ApiBlogResponse = {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    cover_image: blog.cover_image,
    published_at: blog.published_at,
    meta: {
      title: blog.meta_title,
      description: blog.meta_description,
    },
  };

  return NextResponse.json(
    { data: response },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "s-maxage=60, stale-while-revalidate",
      },
    }
  );
}
