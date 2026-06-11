"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { SectionEditor } from "@/components/pages/section-editor";
import { AddSectionDialog } from "@/components/pages/add-section-dialog";
import { Loader2, ChevronLeft, Globe, Rocket, Eye } from "lucide-react";
import Link from "next/link";
import { logActivity } from "@/lib/log-activity";
import type { Page, Section } from "@/types";

interface Props {
  page: Page;
  sections: Section[];
  websiteSlug: string;
  websiteId: string;
  deployHookUrl: string | null;
  hasRevalidate: boolean;
  previewUrl: string | null;
  previewSecret: string | null;
}

export function PageEditor({ page, sections: initialSections, websiteSlug, websiteId, deployHookUrl, hasRevalidate, previewUrl, previewSecret }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const [meta, setMeta] = useState({
    meta_title: page.meta_title || "",
    meta_description: page.meta_description || "",
    og_image: page.og_image || "",
  });

  async function saveMeta() {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("pages")
      .update({
        meta_title: meta.meta_title || null,
        meta_description: meta.meta_description || null,
        og_image: meta.og_image || null,
      })
      .eq("id", page.id);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "SEO settings saved" });
      logActivity({ websiteId, action: "page.meta_saved", entityType: "page", entityId: page.id, entityLabel: page.title });
      startTransition(() => router.refresh());
    }
    setSaving(false);
  }

  async function callRevalidate(path: string) {
    try {
      const res = await fetch("/api/internal/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, path }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Revalidation failed", description: data.error, variant: "destructive" });
      } else if (data.success) {
        toast({ title: "Page revalidated", description: "Client site will serve fresh content." });
      }
    } catch {
      toast({ title: "Revalidation request failed", variant: "destructive" });
    }
  }

  async function togglePublish() {
    setPublishing(true);
    const supabase = createClient();
    const newStatus = page.status === "published" ? "draft" : "published";

    const { error } = await supabase
      .from("pages")
      .update({ status: newStatus })
      .eq("id", page.id);

    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: newStatus === "published" ? "Page published" : "Page unpublished",
      });
      logActivity({ websiteId, action: newStatus === "published" ? "page.published" : "page.unpublished", entityType: "page", entityId: page.id, entityLabel: page.title });
      if (newStatus === "published" && hasRevalidate) {
        await callRevalidate(`/${page.slug}`);
      }
      startTransition(() => router.refresh());
    }
    setPublishing(false);
  }

  async function publishAndDeploy() {
    setDeploying(true);

    // Step 1: publish the page
    const supabase = createClient();
    const { error: publishError } = await supabase
      .from("pages")
      .update({ status: "published" })
      .eq("id", page.id);

    if (publishError) {
      toast({ title: "Publish failed", description: publishError.message, variant: "destructive" });
      setDeploying(false);
      return;
    }

    toast({ title: "Page published" });
    logActivity({ websiteId, action: "page.published", entityType: "page", entityId: page.id, entityLabel: page.title });

    // Step 2: trigger the Vercel deploy hook via the server-side route
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

    // Step 3: call revalidate webhook if configured
    if (hasRevalidate) {
      await callRevalidate(`/${page.slug}`);
    }

    startTransition(() => router.refresh());
    setDeploying(false);
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${websiteSlug}/pages`}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{page.title}</h1>
              <Badge variant={page.status === "published" ? "success" : "warning"}>
                {page.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-mono">/{page.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Preview: opens the client site's preview route in a new tab */}
          {previewUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const url = `${previewUrl}?secret=${previewSecret ?? ""}&slug=${page.slug}`;
                window.open(url, "_blank");
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          )}
          {/* Publish & Deploy: only shown when draft and a deploy hook is configured */}
          {page.status === "draft" && deployHookUrl && (
            <Button
              onClick={publishAndDeploy}
              disabled={deploying || publishing}
              size="sm"
              variant="default"
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
            onClick={togglePublish}
            variant={page.status === "published" ? "outline" : "outline"}
            disabled={publishing || deploying}
            size="sm"
          >
            {publishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {page.status === "published" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Content Sections
          </h2>
          <AddSectionDialog pageId={page.id} currentCount={initialSections.length} />
        </div>

        {initialSections.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg py-12 text-center">
            <p className="text-sm text-muted-foreground mb-3">No sections yet</p>
            <AddSectionDialog pageId={page.id} currentCount={0} />
          </div>
        ) : (
          <div className="space-y-3">
            {initialSections.map((section) => (
              <SectionEditor key={section.id} section={section} />
            ))}
          </div>
        )}
      </div>

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
              placeholder={page.title}
              value={meta.meta_title}
              onChange={(e) => setMeta((p) => ({ ...p, meta_title: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Meta Description</Label>
            <Textarea
              placeholder="Page description for search engines..."
              value={meta.meta_description}
              onChange={(e) => setMeta((p) => ({ ...p, meta_description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label>OG Image URL</Label>
            <Input
              placeholder="https://..."
              value={meta.og_image}
              onChange={(e) => setMeta((p) => ({ ...p, og_image: e.target.value }))}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={saveMeta} disabled={saving} size="sm" variant="outline">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save SEO
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
