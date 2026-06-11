import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/blogs/blog-editor";

interface Props {
  params: Promise<{ websiteSlug: string }>;
}

export default async function NewBlogPage({ params }: Props) {
  const { websiteSlug } = await params;
  const supabase = await createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("id, name, slug, deploy_hook_url, revalidate_url, preview_url, preview_secret")
    .eq("slug", websiteSlug)
    .single();

  if (!website) notFound();

  return (
    <BlogEditor
      websiteId={website.id}
      websiteSlug={websiteSlug}
      blog={null}
      deployHookUrl={website.deploy_hook_url ?? null}
      hasRevalidate={!!website.revalidate_url}
      previewUrl={website.preview_url ?? null}
      previewSecret={website.preview_secret ?? null}
    />
  );
}
