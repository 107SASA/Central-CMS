import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Newspaper, Plus, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Blog } from "@/types";

interface Props {
  params: Promise<{ websiteSlug: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function BlogsPage({ params, searchParams }: Props) {
  const { websiteSlug } = await params;
  const { q } = await searchParams;
  const supabase = await createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("id, name, slug")
    .eq("slug", websiteSlug)
    .single();

  if (!website) notFound();

  let query = supabase
    .from("blogs")
    .select("*")
    .eq("website_id", website.id)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data: blogs } = await query;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="text-sm text-muted-foreground mt-1">{website.name}</p>
        </div>
        <Link href={`/dashboard/${websiteSlug}/blogs/new`}>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search */}
      <form className="mb-6" method="get">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search posts..."
            className="pl-9"
          />
        </div>
      </form>

      {!blogs || blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Newspaper className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">{q ? "No posts found" : "No blog posts yet"}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {q ? `No results for "${q}"` : "Create your first blog post."}
          </p>
          {!q && (
            <Link href={`/dashboard/${websiteSlug}/blogs/new`}>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Published</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {(blogs as Blog[]).map((blog) => (
                <tr key={blog.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{blog.title}</p>
                      <p className="text-xs text-muted-foreground font-mono">/{blog.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={blog.status === "published" ? "success" : "warning"}>
                      {blog.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(blog.published_at)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(blog.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/${websiteSlug}/blogs/${blog.id}`}>
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
