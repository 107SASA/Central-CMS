"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, Loader2, Trash2, Globe, Rocket, Eye } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import { logActivity } from "@/lib/log-activity";
import type { Blog } from "@/types";

interface Props {
  websiteId: string;
  websiteSlug: string;
  blog: Blog | null;
  deployHookUrl: string | null;
  hasRevalidate: boolean;
  previewUrl: string | null;
  previewSecret: string | null;
}

export function BlogEditor({ websiteId, websiteSlug, blog, deployHookUrl, hasRevalidate, previewUrl, previewSecret }: Props) {
  const router = useRouter();
  const isNew = !blog;

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const [form, setForm] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    cover_image: blog?.cover_image || "",
    meta_title: blog?.meta_title || "",
    meta_description: blog?.meta_description || "",
  });

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isNew || prev.slug === slugify(prev.title) ? slugify(title) : prev.slug,
    }));
  }

  async function handleSave(status?: "draft" | "published") {
    if (!form.title || !form.slug) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }

    const targetStatus = status || blog?.status || "draft";
    setSaving(true);
    const supabase = createClient();

    const payload = {
      website_id: websiteId,
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      cover_image: form.cover_image || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      status: targetStatus,
      published_at:
        targetStatus === "published" && !blog?.published_at
          ? new Date().toISOString()
          : blog?.published_at || null,
    };

    let error;
    if (isNew) {
      const res = await supabase.from("blogs").insert(payload).select().single();
      error = res.error;
      if (!error && res.data) {
        toast({ title: "Blog post created" });
        logActivity({ websiteId, action: "blog.created", entityType: "blog", entityId: res.data.id, entityLabel: form.title });
        router.push(`/dashboard/${websiteSlug}/blogs/${res.data.id}`);
      }
    } else {
      const res = await supabase.from("blogs").update(payload).eq("id", blog.id);
      error = res.error;
      if (!error) {
        toast({ title: "Saved" });
        logActivity({ websiteId, action: "blog.saved", entityType: "blog", entityId: blog.id, entityLabel: form.title });
        router.refresh();
      }
    }

    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    }
    setSaving(false);
  }

  async function callRevalidate(slug: string) {
    try {
      const res = await fetch("/api/internal/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, path: `/blog/${slug}` }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Revalidation failed", description: data.error, variant: "destructive" });
      } else if (data.success) {
        toast({ title: "Post revalidated", description: "Client site will serve fresh content." });
      }
    } catch {
      toast({ title: "Revalidation request failed", variant: "destructive" });
    }
  }

  async function handlePublishToggle() {
    if (isNew) return handleSave("published");
    setPublishing(true);
    const supabase = createClient();
    const newStatus = blog.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("blogs")
      .update({
        status: newStatus,
        published_at:
          newStatus === "published" && !blog.published_at
            ? new Date().toISOString()
            : blog.published_at,
      })
      .eq("id", blog.id);

    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: newStatus === "published" ? "Post published" : "Post unpublished" });
      logActivity({ websiteId, action: newStatus === "published" ? "blog.published" : "blog.unpublished", entityType: "blog", entityId: blog.id, entityLabel: blog.title });
      if (newStatus === "published" && hasRevalidate) {
        await callRevalidate(blog.slug);
      }
      router.refresh();
    }
    setPublishing(false);
  }

  async function handlePublishAndDeploy() {
    // For new posts, save as published first, then deploy
    if (isNew) {
      await handleSave("published");
      // handleSave redirects to edit page on success, so deploy happens after redirect
      // We'll trigger deploy from the edit page on next render — not ideal, so we handle it inline:
    }

    setDeploying(true);

    // For existing posts: publish first if currently draft
    if (!isNew && blog.status === "draft") {
      const supabase = createClient();
      const { error } = await supabase
        .from("blogs")
        .update({
          status: "published",
          published_at: blog.published_at || new Date().toISOString(),
        })
        .eq("id", blog.id);

      if (error) {
        toast({ title: "Publish failed", description: error.message, variant: "destructive" });
        setDeploying(false);
        return;
      }
      toast({ title: "Post published" });
      logActivity({ websiteId, action: "blog.published", entityType: "blog", entityId: blog.id, entityLabel: blog.title });
    }

    // Trigger deploy hook
    try {
      const res = await fetch("/api/internal/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Deploy failed", description: data.error, variant: "destructive" });
      } else {
        toast({ title: "Deployment triggered", description: "Vercel is rebuilding the site." });
      }
    } catch {
      toast({ title: "Deploy request failed", variant: "destructive" });
    }

    // Trigger revalidate webhook if configured (existing blogs only)
    if (!isNew && hasRevalidate) {
      await callRevalidate(blog.slug);
    }

    router.refresh();
    setDeploying(false);
  }

  async function handleDelete() {
    if (!blog) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("blogs").delete().eq("id", blog.id);
    if (error) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post deleted" });
      logActivity({ websiteId, action: "blog.deleted", entityType: "blog", entityId: blog.id, entityLabel: blog.title });
      router.push(`/dashboard/${websiteSlug}/blogs`);
    }
    setDeleting(false);
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${websiteSlug}/blogs`}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isNew ? "New Post" : form.title || "Edit Post"}
            </h1>
            {!isNew && (
              <Badge variant={blog.status === "published" ? "success" : "warning"}>
                {blog.status}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete post?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete &quot;{blog.title}&quot;.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Preview: opens client site preview route in a new tab */}
          {previewUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const slug = blog?.slug || form.slug;
                const url = `${previewUrl}?secret=${previewSecret ?? ""}&slug=${slug}&type=blog`;
                window.open(url, "_blank");
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => handleSave()} disabled={saving || deploying}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Draft
          </Button>
          {/* Publish & Deploy: only shown when draft/new and a deploy hook is configured */}
          {(isNew || blog?.status === "draft") && deployHookUrl && (
            <Button
              size="sm"
              onClick={handlePublishAndDeploy}
              disabled={deploying || publishing || saving}
            >
              {deploying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Rocket className="mr-2 h-4 w-4" />
              )}
              Publish &amp; Deploy
            </Button>
          )}
          <Button
            size="sm"
            onClick={handlePublishToggle}
            disabled={publishing || deploying}
            variant={blog?.status === "published" ? "outline" : "outline"}
          >
            {publishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {blog?.status === "published" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main content */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              placeholder="Post title..."
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input
              placeholder="post-slug"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Excerpt</Label>
            <Textarea
              placeholder="Brief description of the post..."
              value={form.excerpt}
              onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Cover Image URL</Label>
            <Input
              placeholder="https://... (from Media Library)"
              value={form.cover_image}
              onChange={(e) => setForm((p) => ({ ...p, cover_image: e.target.value }))}
            />
            {form.cover_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.cover_image}
                alt="cover"
                className="h-40 w-full rounded-lg border object-cover"
              />
            )}
          </div>
        </div>

        <Separator />

        {/* Content */}
        <div className="space-y-1.5">
          <Label>Content</Label>
          <div className="border rounded-lg p-4 min-h-[400px]">
            <RichTextEditor
              content={form.content}
              onChange={(value) => setForm((p) => ({ ...p, content: value }))}
              placeholder="Write your blog post..."
            />
          </div>
        </div>

        <Separator />

        {/* SEO */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              SEO & Meta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Meta Title</Label>
              <Input
                placeholder={form.title}
                value={form.meta_title}
                onChange={(e) => setForm((p) => ({ ...p, meta_title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Meta Description</Label>
              <Textarea
                placeholder="Description for search engines..."
                value={form.meta_description}
                onChange={(e) => setForm((p) => ({ ...p, meta_description: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
