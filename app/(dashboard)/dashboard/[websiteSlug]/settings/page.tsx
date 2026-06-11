import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { WebsiteSettingsForm } from "@/components/websites/website-settings-form";
import type { Profile, Website } from "@/types";

interface Props {
  params: Promise<{ websiteSlug: string }>;
}

export default async function WebsiteSettingsPage({ params }: Props) {
  const { websiteSlug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((profile as Profile)?.role !== "admin") {
    redirect(`/dashboard/${websiteSlug}`);
  }

  const { data: website } = await supabase
    .from("websites")
    .select("*")
    .eq("slug", websiteSlug)
    .single();

  if (!website) notFound();

  return <WebsiteSettingsForm website={website as Website} />;
}
