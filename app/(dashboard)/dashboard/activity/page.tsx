import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ActivityLogTable } from "@/components/activity/activity-log-table";
import type { ActivityLog, Profile } from "@/types";

export default async function GlobalActivityPage() {
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
    redirect("/dashboard");
  }

  const { data: logs } = await supabase
    .from("activity_log")
    .select("*, website:websites(name, slug)")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Activity Log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All activity across all websites — last 200 events
        </p>
      </div>
      <ActivityLogTable logs={(logs || []) as ActivityLog[]} showWebsite />
    </div>
  );
}
