import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

interface LogParams {
  websiteId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  entityLabel?: string;
  metadata?: Record<string, unknown>;
}

// For client components: creates its own browser client, resolves user from the active session.
// Silently swallows errors so logging never breaks the main flow.
export async function logActivity(params: LogParams) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("activity_log").insert({
      website_id: params.websiteId || null,
      user_id: user.id,
      user_email: user.email || "",
      action: params.action,
      entity_type: params.entityType || null,
      entity_id: params.entityId || null,
      entity_label: params.entityLabel || null,
      metadata: params.metadata || null,
    });
  } catch {}
}

// For server-side API routes: takes an existing Supabase client (service role or server SSR)
// plus the already-resolved user id and email.
export async function logServerActivity(
  supabase: SupabaseClient,
  userId: string,
  userEmail: string,
  params: LogParams
) {
  try {
    await supabase.from("activity_log").insert({
      website_id: params.websiteId || null,
      user_id: userId,
      user_email: userEmail,
      action: params.action,
      entity_type: params.entityType || null,
      entity_id: params.entityId || null,
      entity_label: params.entityLabel || null,
      metadata: params.metadata || null,
    });
  } catch {}
}
