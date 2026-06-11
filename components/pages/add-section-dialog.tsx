"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DEFAULT_FIELDS } from "@/lib/page-seed-config";
import { toast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";

const SECTION_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "about", label: "About / Mission" },
  { value: "services", label: "Services" },
  { value: "team", label: "Team" },
  { value: "testimonials", label: "Testimonials" },
  { value: "stats", label: "Stats Strip" },
  { value: "cta", label: "CTA (Call to Action)" },
  { value: "contact", label: "Contact" },
  { value: "footer", label: "Footer" },
  { value: "gallery", label: "Gallery" },
  { value: "faq", label: "FAQ" },
  { value: "custom", label: "Custom" },
];

interface Props {
  pageId: string;
  currentCount: number;
}

export function AddSectionDialog({ pageId, currentCount }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sectionType, setSectionType] = useState("");
  const [label, setLabel] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sectionType) return;

    setLoading(true);
    const supabase = createClient();

    const { data: section, error: sectionError } = await supabase
      .from("sections")
      .insert({
        page_id: pageId,
        section_type: sectionType,
        label: label || SECTION_TYPES.find((t) => t.value === sectionType)?.label,
        order_index: currentCount,
      })
      .select()
      .single();

    if (sectionError || !section) {
      toast({ title: "Failed to add section", description: sectionError?.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const defaultFields = DEFAULT_FIELDS[sectionType] || [];
    if (defaultFields.length > 0) {
      const fieldsToInsert = defaultFields.map((f, i) => ({
        section_id: section.id,
        field_key: f.key,
        field_label: f.label,
        field_type: f.type,
        field_value: f.default_value ?? null,  // pre-fill with current live content
        order_index: i,
      }));

      const { error: fieldsError } = await supabase
        .from("section_fields")
        .insert(fieldsToInsert);

      if (fieldsError) {
        toast({ title: "Section created but fields failed", description: fieldsError.message, variant: "destructive" });
      }
    }

    toast({ title: "Section added — fields pre-filled with current site content" });
    setOpen(false);
    setSectionType("");
    setLabel("");
    router.refresh();
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
          <DialogDescription>
            Fields are pre-filled with the current live content — edit only what you want to change.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Section Type</Label>
              <Select value={sectionType} onValueChange={setSectionType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type..." />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Label (optional)</Label>
              <Input
                placeholder="Custom label..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !sectionType}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Section
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
