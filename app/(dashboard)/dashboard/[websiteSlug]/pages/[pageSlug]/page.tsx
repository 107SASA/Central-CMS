import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PageEditor } from "@/components/pages/page-editor";
import type { Page, Section, SectionField } from "@/types";

interface Props {
  params: Promise<{ websiteSlug: string; pageSlug: string }>;
}

export default async function PageEditorPage({ params }: Props) {
  const { websiteSlug, pageSlug } = await params;
  const supabase = await createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("id, name, slug, deploy_hook_url, revalidate_url, preview_url, preview_secret")
    .eq("slug", websiteSlug)
    .single();

  if (!website) notFound();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("website_id", website.id)
    .eq("slug", pageSlug)
    .single();

  if (!page) notFound();

  const { data: sections } = await supabase
    .from("sections")
    .select("*, fields:section_fields(*)")
    .eq("page_id", page.id)
    .order("order_index", { ascending: true });

  const sectionsWithFields = (sections || []).map((s) => ({
    ...s,
    fields: (s.fields || []).sort(
      (a: SectionField, b: SectionField) => a.order_index - b.order_index
    ),
  }));

  return (
    <PageEditor
      page={page as Page}
      sections={sectionsWithFields as Section[]}
      websiteSlug={websiteSlug}
      websiteId={website.id}
      deployHookUrl={website.deploy_hook_url ?? null}
      hasRevalidate={!!website.revalidate_url}
      previewUrl={website.preview_url ?? null}
      previewSecret={website.preview_secret ?? null}
    />
  );
}
