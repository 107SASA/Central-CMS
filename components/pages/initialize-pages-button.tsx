"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

interface Props {
  websiteId: string;
}

export function InitializePagesButton({ websiteId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleInit() {
    setLoading(true);
    try {
      const res = await fetch("/api/internal/seed-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Failed to initialize pages", description: data.error, variant: "destructive" });
        return;
      }

      const { created, skipped, errors } = data as {
        created: string[];
        skipped: string[];
        errors: string[];
      };

      if (created.length > 0) {
        toast({
          title: `${created.length} page${created.length > 1 ? "s" : ""} initialized`,
          description: [
            created.length ? `Created: ${created.join(", ")}` : null,
            skipped.length ? `Already existed: ${skipped.join(", ")}` : null,
            errors.length ? `Failed: ${errors.join(", ")}` : null,
          ]
            .filter(Boolean)
            .join(" · "),
        });
        router.refresh();
      } else if (skipped.length > 0 && created.length === 0) {
        toast({
          title: "All pages already exist",
          description: `${skipped.join(", ")} — open any page to edit content.`,
        });
      } else {
        toast({ title: "No pages were created", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to initialize pages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleInit} disabled={loading} variant="outline">
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      {loading ? "Initializing…" : "Initialize Pages"}
    </Button>
  );
}
