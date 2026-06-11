import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MediaLibrary } from "@/components/media/media-library";
import type { Media } from "@/types";

interface Props {
  params: Promise<{ websiteSlug: string }>;
}

export default async function MediaPage({ params }: Props) {
  const { websiteSlug } = await params;
  const supabase = await createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("id, name, slug")
    .eq("slug", websiteSlug)
    .single();

  if (!website) notFound();

  const { data: media } = await supabase
    .from("media")
    .select("*")
    .eq("website_id", website.id)
    .order("uploaded_at", { ascending: false });

  return (
    <MediaLibrary
      websiteId={website.id}
      websiteSlug={websiteSlug}
      websiteName={website.name}
      initialMedia={(media || []) as Media[]}
    />
  );
}
