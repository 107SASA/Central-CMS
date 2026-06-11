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

export function AddWebsiteDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", domain: "" });

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug === slugify(prev.name) || prev.slug === "" ? slugify(name) : prev.slug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug) return;

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.from("websites").insert({
      name: form.name,
      slug: form.slug,
      domain: form.domain || null,
    });

    if (error) {
      toast({
        title: "Failed to create website",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({ title: "Website created", description: `${form.name} has been added.` });
    setOpen(false);
    setForm({ name: "", slug: "", domain: "" });
    router.refresh();
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add Website
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Website</DialogTitle>
          <DialogDescription>
            Add a new client website to manage its content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Website Name</Label>
              <Input
                id="name"
                placeholder="Acme Corp"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="acme-corp"
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
                required
              />
              <p className="text-xs text-muted-foreground">
                Used in API URLs: /api/<strong>{form.slug || "slug"}</strong>/pages
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="domain">Domain (optional)</Label>
              <Input
                id="domain"
                placeholder="https://acmecorp.com"
                value={form.domain}
                onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Website
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
