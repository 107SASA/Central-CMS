import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { SchemaErrorPage } from "@/components/layout/schema-error-page";
import type { Profile, Website } from "@/types";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Profile row is missing — either the schema hasn't been run yet or the
    // on_auth_user_created trigger didn't fire.
    //
    // Do NOT call redirect("/login") here: supabase.auth.signOut() silently
    // fails from a Server Component (cookies are read-only), so the session
    // cookie stays intact and the middleware bounces the user back to /dashboard
    // forever (ERR_TOO_MANY_REDIRECTS).
    //
    // Instead render an inline error page with a client-side sign-out link
    // pointing to /api/auth/signout (a Route Handler that CAN clear cookies).
    return <SchemaErrorPage />;
  }

  const { data: websites } = await supabase
    .from("websites")
    .select("name, slug")
    .order("created_at", { ascending: true });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        profile={profile as Profile}
        websites={websites as Website[]}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
