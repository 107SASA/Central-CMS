import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Newspaper, Image, ExternalLink, Key, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ websiteSlug: string }>;
}

export default async function WebsiteOverviewPage({ params }: Props) {
  const { websiteSlug } = await params;
  const supabase = await createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("*")
    .eq("slug", websiteSlug)
    .single();

  if (!website) notFound();

  const [{ count: pagesCount }, { count: blogsCount }, { count: mediaCount }] = await Promise.all([
    supabase.from("pages").select("*", { count: "exact", head: true }).eq("website_id", website.id),
    supabase.from("blogs").select("*", { count: "exact", head: true }).eq("website_id", website.id),
    supabase.from("media").select("*", { count: "exact", head: true }).eq("website_id", website.id),
  ]);

  const stats = [
    { label: "Pages", value: pagesCount ?? 0, href: `/dashboard/${websiteSlug}/pages`, icon: FileText },
    { label: "Blog Posts", value: blogsCount ?? 0, href: `/dashboard/${websiteSlug}/blogs`, icon: Newspaper },
    { label: "Media Files", value: mediaCount ?? 0, href: `/dashboard/${websiteSlug}/media`, icon: Image },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-semibold tracking-tight">{website.name}</h1>
          <Badge variant="secondary">Active</Badge>
        </div>
        {website.domain && (
          <a
            href={website.domain}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {website.domain}
          </a>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-foreground/20 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* API Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Access
            </CardTitle>
            <Link href={`/dashboard/${websiteSlug}/settings`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                Manage key
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Endpoints</p>
            <div className="space-y-1">
              {[
                `/api/${websiteSlug}/pages`,
                `/api/${websiteSlug}/pages/[slug]`,
                `/api/${websiteSlug}/blogs`,
                `/api/${websiteSlug}/blogs/[slug]`,
              ].map((endpoint) => (
                <code
                  key={endpoint}
                  className="flex items-center text-xs bg-muted px-2 py-1 rounded font-mono"
                >
                  <span className="text-muted-foreground mr-2">GET</span>
                  {endpoint}
                </code>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            All requests require the{" "}
            <code className="bg-muted px-1 rounded">x-api-key</code> header.{" "}
            <Link
              href={`/dashboard/${websiteSlug}/settings`}
              className="underline underline-offset-2 hover:text-foreground"
            >
              View API key in Settings →
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
