import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ActivityLogTable } from "@/components/activity/activity-log-table";
import type { ActivityLog } from "@/types";

interface Props {
  params: Promise<{ websiteSlug: string }>;
}

export default async function WebsiteActivityPage({ params }: Props) {
  const { websiteSlug } = await params;
  const supabase = await createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("id, name")
    .eq("slug", websiteSlug)
    .single();

  if (!website) notFound();

  const { data: logs } = await supabase
    .from("activity_log")
    .select("*")
    .eq("website_id", website.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {website.name} — last 100 events
        </p>
      </div>
      <ActivityLogTable logs={(logs || []) as ActivityLog[]} />
    </div>
  );
}
