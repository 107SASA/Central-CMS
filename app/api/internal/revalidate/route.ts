import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { logServerActivity } from "@/lib/log-activity";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const serverSupabase = await createServerClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { websiteId, path } = await request.json();
  if (!websiteId || !path) {
    return NextResponse.json(
      { error: "websiteId and path are required" },
      { status: 400 }
    );
  }

  const admin = getServiceClient();
  const { data: website, error: dbError } = await admin
    .from("websites")
    .select("revalidate_url, revalidate_secret")
    .eq("id", websiteId)
    .single();

  if (dbError || !website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  if (!website.revalidate_url) {
    return NextResponse.json({ skipped: true });
  }

  try {
    const revalidateResponse = await fetch(website.revalidate_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: website.revalidate_secret || "",
        path,
      }),
    });

    if (!revalidateResponse.ok) {
      const body = await revalidateResponse.text().catch(() => "");
      return NextResponse.json(
        {
          error: `Revalidation endpoint returned ${revalidateResponse.status}${
            body ? `: ${body}` : ""
          }`,
        },
        { status: 502 }
      );
    }

    await logServerActivity(admin, user.id, user.email || "", {
      websiteId,
      action: "revalidate.triggered",
      entityType: "website",
      entityId: websiteId,
      metadata: { path },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to reach revalidation endpoint: ${message}` },
      { status: 502 }
    );
  }
}
