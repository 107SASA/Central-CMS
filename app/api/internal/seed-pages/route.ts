import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_FIELDS, STANDARD_PAGES } from "@/lib/page-seed-config";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  // Verify the caller is an authenticated CMS user
  const serverSupabase = await createServerClient();
  const { data: { user } } = await serverSupabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { websiteId } = await request.json();
  if (!websiteId) return NextResponse.json({ error: "websiteId is required" }, { status: 400 });

  const admin = getServiceClient();

  const created: string[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];

  for (const pageConfig of STANDARD_PAGES) {
    // Skip if this page slug already exists for this website
    const { data: existing } = await admin
      .from("pages")
      .select("id")
      .eq("website_id", websiteId)
      .eq("slug", pageConfig.slug)
      .maybeSingle();

    if (existing) {
      skipped.push(pageConfig.slug);
      continue;
    }

    // Create the page
    const { data: page, error: pageError } = await admin
      .from("pages")
      .insert({
        website_id: websiteId,
        title: pageConfig.title,
        slug: pageConfig.slug,
        status: "published",
      })
      .select()
      .single();

    if (pageError || !page) {
      errors.push(pageConfig.slug);
      continue;
    }

    // Create sections + fields
    for (let i = 0; i < pageConfig.sections.length; i++) {
      const sec = pageConfig.sections[i];

      const { data: section, error: secError } = await admin
        .from("sections")
        .insert({
          page_id: page.id,
          section_type: sec.type,
          label: sec.label,
          order_index: i,
        })
        .select()
        .single();

      if (secError || !section) continue;

      const fields = DEFAULT_FIELDS[sec.type] ?? [];
      if (fields.length > 0) {
        await admin.from("section_fields").insert(
          fields.map((f, j) => ({
            section_id: section.id,
            field_key: f.key,
            field_label: f.label,
            field_type: f.type,
            field_value: f.default_value ?? null,
            order_index: j,
          }))
        );
      }
    }

    created.push(pageConfig.slug);
  }

  return NextResponse.json({ created, skipped, errors });
}
