import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { logServerActivity } from "@/lib/log-activity";

// Service role client — needed to read deploy_hook_url without exposing it to the browser
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  // 1. Verify the caller is an authenticated CMS user
  const serverSupabase = await createServerClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { websiteId } = await request.json();
  if (!websiteId) {
    return NextResponse.json({ error: "websiteId is required" }, { status: 400 });
  }

  // 2. Fetch deploy hook URL server-side so it is never sent to the browser
  const admin = getServiceClient();
  const { data: website, error: dbError } = await admin
    .from("websites")
    .select("deploy_hook_url")
    .eq("id", websiteId)
    .single();

  if (dbError || !website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  if (!website.deploy_hook_url) {
    return NextResponse.json(
      { error: "No deploy hook configured for this website" },
      { status: 400 }
    );
  }

  // 3. Call the Vercel deploy hook (POST with no body — the URL is self-authenticating)
  try {
    const hookResponse = await fetch(website.deploy_hook_url, {
      method: "POST",
    });

    if (!hookResponse.ok) {
      const body = await hookResponse.text().catch(() => "");
      return NextResponse.json(
        { error: `Deploy hook returned ${hookResponse.status}${body ? `: ${body}` : ""}` },
        { status: 502 }
      );
    }

    await logServerActivity(admin, user.id, user.email || "", {
      websiteId,
      action: "deploy.triggered",
      entityType: "website",
      entityId: websiteId,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to reach deploy hook: ${message}` },
      { status: 502 }
    );
  }
}
