import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Plus, ExternalLink } from "lucide-react";
import { AddWebsiteDialog } from "@/components/websites/add-website-dialog";
import type { Website, Profile } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: websites }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("websites").select("*").order("created_at", { ascending: true }),
  ]);

  const isAdmin = (profile as Profile)?.role === "admin";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Websites</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage content for all client websites
          </p>
        </div>
        {isAdmin && <AddWebsiteDialog />}
      </div>

      {!websites || websites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Globe className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">No websites yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first client website to get started.
          </p>
          {isAdmin && <AddWebsiteDialog />}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(websites as Website[]).map((website) => (
            <Link key={website.id} href={`/dashboard/${website.slug}`}>
              <Card className="hover:border-foreground/20 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {website.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={website.logo_url}
                          alt={website.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-base">{website.name}</CardTitle>
                        <CardDescription className="text-xs">{website.slug}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {website.domain ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate max-w-[140px]">{website.domain}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No domain set</span>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
