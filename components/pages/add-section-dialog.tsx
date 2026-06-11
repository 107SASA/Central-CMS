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
import { toast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";

const SECTION_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "about", label: "About" },
  { value: "services", label: "Services" },
  { value: "team", label: "Team" },
  { value: "testimonials", label: "Testimonials" },
  { value: "cta", label: "CTA (Call to Action)" },
  { value: "contact", label: "Contact" },
  { value: "footer", label: "Footer" },
  { value: "gallery", label: "Gallery" },
  { value: "faq", label: "FAQ" },
  { value: "custom", label: "Custom" },
];

const DEFAULT_FIELDS: Record<string, Array<{ key: string; label: string; type: string }>> = {
  hero: [
    { key: "headline", label: "Headline", type: "text" },
    { key: "subheadline", label: "Subheadline", type: "textarea" },
    { key: "cta_text", label: "CTA Button Text", type: "text" },
    { key: "cta_url", label: "CTA Button URL", type: "url" },
    { key: "background_image", label: "Background Image", type: "image" },
  ],
  about: [
    { key: "title", label: "Title", type: "text" },
    { key: "content", label: "Content", type: "richtext" },
    { key: "image", label: "Image", type: "image" },
  ],
  services: [
    { key: "title", label: "Section Title", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "textarea" },
    { key: "services_json", label: "Services (JSON)", type: "textarea" },
  ],
  team: [
    { key: "title", label: "Section Title", type: "text" },
    { key: "team_json", label: "Team Members (JSON)", type: "textarea" },
  ],
  testimonials: [
    { key: "title", label: "Section Title", type: "text" },
    { key: "testimonials_json", label: "Testimonials (JSON)", type: "textarea" },
  ],
  cta: [
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "button_text", label: "Button Text", type: "text" },
    { key: "button_url", label: "Button URL", type: "url" },
  ],
  contact: [
    { key: "title", label: "Title", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "address", label: "Address", type: "textarea" },
  ],
  footer: [
    { key: "copyright", label: "Copyright Text", type: "text" },
    { key: "links_json", label: "Footer Links (JSON)", type: "textarea" },
  ],
  gallery: [
    { key: "title", label: "Title", type: "text" },
    { key: "images_json", label: "Images (JSON)", type: "textarea" },
  ],
  faq: [
    { key: "title", label: "Title", type: "text" },
    { key: "faqs_json", label: "FAQs (JSON)", type: "textarea" },
  ],
  custom: [
    { key: "title", label: "Title", type: "text" },
    { key: "content", label: "Content", type: "richtext" },
  ],
};

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
        field_value: null,
        order_index: i,
      }));

      const { error: fieldsError } = await supabase
        .from("section_fields")
        .insert(fieldsToInsert);

      if (fieldsError) {
        toast({ title: "Section created but fields failed", description: fieldsError.message, variant: "destructive" });
      }
    }

    toast({ title: "Section added" });
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
            Choose a section type. Default fields will be created automatically.
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
