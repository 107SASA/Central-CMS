import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";
import { AddPageDialog } from "@/components/pages/add-page-dialog";
import { formatDate } from "@/lib/utils";
import type { Page } from "@/types";

interface Props {
  params: Promise<{ websiteSlug: string }>;
}

export default async function PagesPage({ params }: Props) {
  const { websiteSlug } = await params;
  const supabase = await createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("id, name, slug")
    .eq("slug", websiteSlug)
    .single();

  if (!website) notFound();

  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .eq("website_id", website.id)
    .order("created_at", { ascending: true });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
          <p className="text-sm text-muted-foreground mt-1">{website.name}</p>
        </div>
        <AddPageDialog websiteId={website.id} websiteSlug={websiteSlug} />
      </div>

      {!pages || pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">No pages yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create the first page for this website.
          </p>
          <AddPageDialog websiteId={website.id} websiteSlug={websiteSlug} />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Page</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {(pages as Page[]).map((page) => (
                <tr key={page.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{page.title}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    /{page.slug}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={page.status === "published" ? "success" : "warning"}
                    >
                      {page.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(page.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/${websiteSlug}/pages/${page.slug}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
