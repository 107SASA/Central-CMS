"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Loader2, Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import type { Section, SectionField, FieldType } from "@/types";

interface Props {
  section: Section;
}

export function SectionEditor({ section }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(true);
  const [fields, setFields] = useState<SectionField[]>(section.fields || []);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function updateFieldValue(fieldId: string, value: string) {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, field_value: value } : f))
    );
  }

  async function saveFields() {
    setSaving(true);
    const supabase = createClient();

    const updates = fields.map((f) =>
      supabase
        .from("section_fields")
        .update({ field_value: f.field_value })
        .eq("id", f.id)
    );

    const results = await Promise.all(updates);
    const failed = results.filter((r) => r.error);

    if (failed.length > 0) {
      toast({ title: "Some fields failed to save", variant: "destructive" });
    } else {
      toast({ title: "Section saved" });
      startTransition(() => router.refresh());
    }
    setSaving(false);
  }

  async function deleteSection() {
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("sections").delete().eq("id", section.id);

    if (error) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Section deleted" });
      startTransition(() => router.refresh());
    }
    setDeleting(false);
  }

  async function addCustomField() {
    const key = prompt("Field key (e.g. subtitle):");
    if (!key) return;
    const label = prompt("Field label (e.g. Subtitle):");
    const types = ["text", "textarea", "richtext", "image", "url", "boolean", "number"];
    const type = prompt(`Field type (${types.join(", ")}):`);
    if (!type || !types.includes(type)) return;

    const supabase = createClient();
    const { data: newField, error } = await supabase
      .from("section_fields")
      .insert({
        section_id: section.id,
        field_key: key,
        field_label: label || key,
        field_type: type as FieldType,
        field_value: null,
        order_index: fields.length,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Failed to add field", description: error.message, variant: "destructive" });
    } else if (newField) {
      setFields((prev) => [...prev, newField as SectionField]);
      toast({ title: "Field added" });
    }
  }

  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded((p) => !p)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium text-sm">
                {section.label || section.section_type}
              </span>
            </button>
            <Badge variant="outline" className="text-xs capitalize">
              {section.section_type}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete section?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete the &quot;{section.label || section.section_type}&quot; section
                    and all its fields. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteSection}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="px-4 pb-4 space-y-4">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No fields. Add a custom field below.
            </p>
          ) : (
            fields.map((field) => (
              <FieldInput
                key={field.id}
                field={field}
                onChange={(value) => updateFieldValue(field.id, value)}
              />
            ))
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addCustomField}
              className="text-muted-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Field
            </Button>
            <Button size="sm" onClick={saveFields} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Section
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function FieldInput({
  field,
  onChange,
}: {
  field: SectionField;
  onChange: (value: string) => void;
}) {
  const label = field.field_label || field.field_key;

  switch (field.field_type) {
    case "richtext":
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">{label}</Label>
          <div className="border rounded-md p-3 min-h-[120px]">
            <RichTextEditor
              content={field.field_value || ""}
              onChange={onChange}
            />
          </div>
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">{label}</Label>
          <Textarea
            value={field.field_value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between">
          <Label className="text-xs">{label}</Label>
          <Switch
            checked={field.field_value === "true"}
            onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">{label}</Label>
          <Input
            value={field.field_value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... (paste image URL from Media Library)"
          />
          {field.field_value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={field.field_value}
              alt="preview"
              className="h-24 w-auto rounded border object-cover"
            />
          )}
        </div>
      );

    default:
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">{label}</Label>
          <Input
            value={field.field_value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}...`}
            type={field.field_type === "number" ? "number" : "text"}
          />
        </div>
      );
  }
}
