import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/blogs/blog-editor";
import type { Blog } from "@/types";

interface Props {
  params: Promise<{ websiteSlug: string; blogId: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const { websiteSlug, blogId } = await params;
  const supabase = await createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("id, name, slug, deploy_hook_url, revalidate_url, preview_url, preview_secret")
    .eq("slug", websiteSlug)
    .single();

  if (!website) notFound();

  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", blogId)
    .eq("website_id", website.id)
    .single();

  if (!blog) notFound();

  return (
    <BlogEditor
      websiteId={website.id}
      websiteSlug={websiteSlug}
      blog={blog as Blog}
      deployHookUrl={website.deploy_hook_url ?? null}
      hasRevalidate={!!website.revalidate_url}
      previewUrl={website.preview_url ?? null}
      previewSecret={website.preview_secret ?? null}
    />
  );
}
