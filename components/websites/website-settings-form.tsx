"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
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
import { Copy, RefreshCw, Key, Loader2, CheckCheck, Webhook, Rocket, Zap, Eye } from "lucide-react";
import type { Website } from "@/types";

interface Props {
  website: Website;
}

export function WebsiteSettingsForm({ website }: Props) {
  const [apiKey, setApiKey] = useState(website.api_key);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [deployHookUrl, setDeployHookUrl] = useState(website.deploy_hook_url || "");
  const [savingHook, setSavingHook] = useState(false);
  const [testingHook, setTestingHook] = useState(false);

  const [revalidateUrl, setRevalidateUrl] = useState(website.revalidate_url || "");
  const [revalidateSecret, setRevalidateSecret] = useState(website.revalidate_secret || "");
  const [savingRevalidate, setSavingRevalidate] = useState(false);

  const [previewUrl, setPreviewUrl] = useState(website.preview_url || "");
  const [previewSecret, setPreviewSecret] = useState(website.preview_secret || "");
  const [savingPreview, setSavingPreview] = useState(false);

  async function saveDeployHookUrl() {
    setSavingHook(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("websites")
      .update({ deploy_hook_url: deployHookUrl || null })
      .eq("id", website.id);

    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deploy hook saved" });
    }
    setSavingHook(false);
  }

  async function testDeployHook() {
    if (!deployHookUrl) return;
    setTestingHook(true);
    try {
      const res = await fetch("/api/internal/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId: website.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Deploy hook failed", description: data.error, variant: "destructive" });
      } else {
        toast({ title: "Deployment triggered", description: "Vercel is rebuilding the site." });
      }
    } catch {
      toast({ title: "Request failed", variant: "destructive" });
    }
    setTestingHook(false);
  }

  async function saveRevalidateConfig() {
    setSavingRevalidate(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("websites")
      .update({
        revalidate_url: revalidateUrl || null,
        revalidate_secret: revalidateSecret || null,
      })
      .eq("id", website.id);

    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Revalidate config saved" });
    }
    setSavingRevalidate(false);
  }

  async function savePreviewConfig() {
    setSavingPreview(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("websites")
      .update({
        preview_url: previewUrl || null,
        preview_secret: previewSecret || null,
      })
      .eq("id", website.id);

    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Preview config saved" });
    }
    setSavingPreview(false);
  }

  function copyApiKey() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast({ title: "API key copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRegenerate() {
    setRegenerating(true);
    const supabase = createClient();
    const newKey = crypto.randomUUID();

    const { error } = await supabase
      .from("websites")
      .update({ api_key: newKey })
      .eq("id", website.id);

    if (error) {
      toast({
        title: "Failed to regenerate key",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setApiKey(newKey);
      toast({
        title: "API key regenerated",
        description:
          "Update all client sites with the new key — the old key is now invalid.",
      });
    }
    setRegenerating(false);
  }

  const endpoints = [
    `/api/${website.slug}/pages`,
    `/api/${website.slug}/pages/[slug]`,
    `/api/${website.slug}/blogs`,
    `/api/${website.slug}/blogs/[slug]`,
  ];

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{website.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Website settings &amp; API access
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Key
          </CardTitle>
          <CardDescription>
            Client sites must send this key as the{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
              x-api-key
            </code>{" "}
            request header. Without it, all API requests return{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
              401 Unauthorized
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Key display + copy */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Current Key</Label>
            <div className="flex items-center gap-2">
              <Input
                value={apiKey}
                readOnly
                className="font-mono text-sm bg-muted cursor-text select-all"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyApiKey}
                title="Copy API key"
                className="shrink-0"
              >
                {copied ? (
                  <CheckCheck className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Regenerate */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/60"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Regenerate Key
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Regenerate API key?</AlertDialogTitle>
                <AlertDialogDescription>
                  The current key will be immediately invalidated. Any client site
                  using the old key will receive{" "}
                  <strong>401 Unauthorized</strong> errors until you update it
                  with the new key.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {regenerating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Regenerate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Separator />

          {/* Example */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Example Request
            </p>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto leading-relaxed">
              {`fetch('https://your-cms.vercel.app/api/${website.slug}/pages', {\n  headers: {\n    'x-api-key': '${apiKey}'\n  }\n})`}
            </pre>
          </div>

          {/* Endpoints */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Available Endpoints
            </p>
            <div className="space-y-1">
              {endpoints.map((ep) => (
                <code
                  key={ep}
                  className="flex items-center text-xs bg-muted px-3 py-1.5 rounded font-mono"
                >
                  <span className="text-muted-foreground mr-2">GET</span>
                  {ep}
                </code>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deploy Hook */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Vercel Deploy Hook
          </CardTitle>
          <CardDescription>
            When editors click &quot;Publish &amp; Deploy&quot;, the CMS will POST to this URL
            to trigger a Vercel rebuild. Get this from your Vercel project under{" "}
            <strong>Settings → Git → Deploy Hooks</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Hook URL</Label>
            <Input
              value={deployHookUrl}
              onChange={(e) => setDeployHookUrl(e.target.value)}
              placeholder="https://api.vercel.com/v1/integrations/deploy/..."
              className="font-mono text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={saveDeployHookUrl}
              disabled={savingHook}
            >
              {savingHook && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Hook URL
            </Button>
            {deployHookUrl && (
              <Button
                size="sm"
                variant="ghost"
                onClick={testDeployHook}
                disabled={testingHook}
                className="text-muted-foreground"
              >
                {testingHook ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Rocket className="mr-2 h-3.5 w-3.5" />
                )}
                Test Deploy
              </Button>
            )}
          </div>
          {!deployHookUrl && (
            <p className="text-xs text-muted-foreground">
              No hook configured — the &quot;Publish &amp; Deploy&quot; button will be hidden
              from editors until you add one.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Revalidate Webhook */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Revalidate Webhook
          </CardTitle>
          <CardDescription>
            A lightweight alternative to a full deploy. On every publish action the CMS
            POSTs{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
              {`{ "secret": "...", "path": "/slug" }`}
            </code>{" "}
            to this URL so the client site can call{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
              revalidatePath()
            </code>
            . Both hooks can be active simultaneously.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Revalidate URL</Label>
            <Input
              value={revalidateUrl}
              onChange={(e) => setRevalidateUrl(e.target.value)}
              placeholder="https://clientsite.com/api/revalidate"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Secret</Label>
            <Input
              value={revalidateSecret}
              onChange={(e) => setRevalidateSecret(e.target.value)}
              placeholder="your-revalidation-secret"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Sent as{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                secret
              </code>{" "}
              in the request body. Treat this like a password — only the server ever sends it.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={saveRevalidateConfig}
            disabled={savingRevalidate}
          >
            {savingRevalidate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Revalidate Config
          </Button>
          {revalidateUrl ? (
            <p className="text-xs text-muted-foreground">
              Revalidation will trigger automatically on every publish action.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Not configured — no revalidation webhook will fire on publish.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Preview URL */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview URL
          </CardTitle>
          <CardDescription>
            When configured, a &quot;Preview&quot; button appears in the page and blog
            editors. It opens{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
              {`{preview_url}?secret=...&slug=...`}
            </code>{" "}
            in a new tab so editors can see draft content on the live site before
            publishing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Preview URL</Label>
            <Input
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              placeholder="https://clientsite.com/api/preview"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Preview Secret</Label>
            <Input
              value={previewSecret}
              onChange={(e) => setPreviewSecret(e.target.value)}
              placeholder="your-preview-secret"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Passed as{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                ?secret=
              </code>{" "}
              in the URL. Set this in your Next.js site to enable Draft Mode.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={savePreviewConfig}
            disabled={savingPreview}
          >
            {savingPreview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preview Config
          </Button>
          {previewUrl ? (
            <p className="text-xs text-muted-foreground">
              A &quot;Preview&quot; button will appear in the page and blog editors.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Not configured — no preview button will appear in editors.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
