import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { logServerActivity } from "@/lib/log-activity";

export async function DELETE(request: NextRequest) {
  // Verify caller is admin
  const serverSupabase = await createServerClient();
  const { data: { user } } = await serverSupabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await serverSupabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  if (userId === user.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch email before deleting so we can record it in the log
  const { data: { user: targetUser } } = await adminSupabase.auth.admin.getUserById(userId);
  const targetEmail = targetUser?.email || userId;

  const { error } = await adminSupabase.auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logServerActivity(adminSupabase, user.id, user.email || "", {
    action: "user.removed",
    entityType: "user",
    entityLabel: targetEmail,
  });

  return NextResponse.json({ success: true });
}
