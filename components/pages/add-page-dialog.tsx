"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import { Plus, Loader2 } from "lucide-react";

interface Props {
  websiteId: string;
  websiteSlug: string;
}

export function AddPageDialog({ websiteId, websiteSlug }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "" });

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug === slugify(prev.title) || prev.slug === "" ? slugify(title) : prev.slug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.slug) return;

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.from("pages").insert({
      website_id: websiteId,
      title: form.title,
      slug: form.slug,
      status: "draft",
    });

    if (error) {
      toast({ title: "Failed to create page", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Page created" });
    setOpen(false);
    setForm({ title: "", slug: "" });
    router.refresh();
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add Page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Page</DialogTitle>
          <DialogDescription>Create a new page to manage its content sections.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                placeholder="Home"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="home"
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
                required
              />
              <p className="text-xs text-muted-foreground">
                API path: /api/{websiteSlug}/pages/<strong>{form.slug || "slug"}</strong>
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Page
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
