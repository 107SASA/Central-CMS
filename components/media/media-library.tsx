"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Image as ImageIcon, Upload, MoreVertical, Copy, Trash2, Loader2 } from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils";
import { logActivity } from "@/lib/log-activity";
import type { Media } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface Props {
  websiteId: string;
  websiteSlug: string;
  websiteName: string;
  initialMedia: Media[];
}

export function MediaLibrary({ websiteId, websiteSlug, websiteName, initialMedia }: Props) {
  const [media, setMedia] = useState<Media[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Media | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${websiteSlug}/${uuidv4()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cms-media")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        toast({
          title: `Failed to upload ${file.name}`,
          description: uploadError.message,
          variant: "destructive",
        });
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("cms-media")
        .getPublicUrl(uploadData.path);

      const { data: mediaRecord, error: dbError } = await supabase
        .from("media")
        .insert({
          website_id: websiteId,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
        })
        .select()
        .single();

      if (dbError) {
        toast({ title: "Upload succeeded but failed to save record", variant: "destructive" });
      } else if (mediaRecord) {
        setMedia((prev) => [mediaRecord as Media, ...prev]);
        toast({ title: `${file.name} uploaded` });
        logActivity({ websiteId, action: "media.uploaded", entityType: "media", entityId: mediaRecord.id, entityLabel: file.name });
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(item: Media) {
    const supabase = createClient();

    // Extract storage path from URL
    const urlParts = item.file_url.split("/cms-media/");
    const storagePath = urlParts[1];

    if (storagePath) {
      await supabase.storage.from("cms-media").remove([storagePath]);
    }

    const { error } = await supabase.from("media").delete().eq("id", item.id);

    if (error) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    } else {
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
      if (selectedFile?.id === item.id) setSelectedFile(null);
      toast({ title: "File deleted" });
      logActivity({ websiteId, action: "media.deleted", entityType: "media", entityLabel: item.file_name });
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied to clipboard" });
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Media</h1>
          <p className="text-sm text-muted-foreground mt-1">{websiteName}</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.pdf,.doc,.docx"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload
          </Button>
        </div>
      </div>

      {media.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-foreground/30 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">No files uploaded</h3>
          <p className="text-sm text-muted-foreground">
            Click to upload images and files
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {media.map((item) => (
            <MediaItem
              key={item.id}
              item={item}
              selected={selectedFile?.id === item.id}
              onClick={() => setSelectedFile(item)}
              onCopy={() => copyUrl(item.file_url)}
              onDelete={() => handleDelete(item)}
            />
          ))}
        </div>
      )}

      {/* Selected file info */}
      {selectedFile && (
        <div className="fixed bottom-6 right-6 w-72 border rounded-xl bg-background shadow-xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium truncate">{selectedFile.file_name}</p>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-muted-foreground hover:text-foreground text-xs shrink-0"
            >
              ✕
            </button>
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>{formatFileSize(selectedFile.file_size)}</p>
            <p>{formatDate(selectedFile.uploaded_at)}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => copyUrl(selectedFile.file_url)}
          >
            <Copy className="h-3.5 w-3.5" />
            Copy URL
          </Button>
          <p className="text-xs font-mono text-muted-foreground break-all bg-muted p-2 rounded">
            {selectedFile.file_url}
          </p>
        </div>
      )}
    </div>
  );
}

function MediaItem({
  item,
  selected,
  onClick,
  onCopy,
  onDelete,
}: {
  item: Media;
  selected: boolean;
  onClick: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  const isImage = item.mime_type?.startsWith("image/");

  return (
    <div
      className={`group relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
        selected ? "ring-2 ring-primary border-primary" : "hover:border-foreground/30"
      }`}
      onClick={onClick}
    >
      <div className="aspect-square bg-muted flex items-center justify-center">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.file_url}
            alt={item.file_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase">
              {item.file_name.split(".").pop()}
            </span>
          </div>
        )}
      </div>
      <div className="p-1.5">
        <p className="text-xs truncate font-medium">{item.file_name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(item.file_size)}</p>
      </div>

      {/* Actions overlay */}
      <div
        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6 shadow"
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onCopy}>
              <Copy className="h-3.5 w-3.5" />
              Copy URL
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete file?</AlertDialogTitle>
                  <AlertDialogDescription>
                    &quot;{item.file_name}&quot; will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
