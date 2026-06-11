import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateApiKey } from "@/lib/api-auth";
import type { ApiPageResponse, ApiSection } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ websiteSlug: string; pageSlug: string }> }
) {
  const { websiteSlug, pageSlug } = await params;
  const { valid, websiteId, error } = await validateApiKey(request, websiteSlug);

  if (!valid) return error!;

  const supabase = await createClient();

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("*")
    .eq("website_id", websiteId!)
    .eq("slug", pageSlug)
    .eq("status", "published")
    .single();

  if (pageError || !page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("*, fields:section_fields(*)")
    .eq("page_id", page.id)
    .order("order_index", { ascending: true });

  if (sectionsError) {
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }

  const formattedSections: ApiSection[] = (sections || []).map((section) => {
    const fields: Record<string, string | null> = {};
    (section.fields || [])
      .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
      .forEach((field: { field_key: string; field_value: string | null }) => {
        fields[field.field_key] = field.field_value;
      });

    return {
      type: section.section_type,
      label: section.label,
      order: section.order_index,
      fields,
    };
  });

  const response: ApiPageResponse = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    meta: {
      title: page.meta_title,
      description: page.meta_description,
      og_image: page.og_image,
    },
    sections: formattedSections,
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
