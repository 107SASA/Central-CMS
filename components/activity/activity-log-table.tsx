"use client";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { ActivityLog } from "@/types";

const ACTION_LABELS: Record<string, string> = {
  "page.published": "Published page",
  "page.unpublished": "Unpublished page",
  "page.meta_saved": "Updated page SEO",
  "blog.created": "Created post",
  "blog.saved": "Saved post",
  "blog.published": "Published post",
  "blog.unpublished": "Unpublished post",
  "blog.deleted": "Deleted post",
  "media.uploaded": "Uploaded file",
  "media.deleted": "Deleted file",
  "deploy.triggered": "Triggered deploy",
  "revalidate.triggered": "Triggered revalidation",
  "user.invited": "Invited user",
  "user.removed": "Removed user",
};

function actionVariant(
  action: string
): "default" | "secondary" | "destructive" | "outline" {
  if (action.endsWith(".deleted") || action === "user.removed")
    return "destructive";
  if (action.endsWith(".unpublished")) return "outline";
  if (
    action.endsWith(".published") ||
    action.endsWith(".created") ||
    action === "deploy.triggered" ||
    action === "revalidate.triggered" ||
    action === "user.invited"
  )
    return "default";
  return "secondary";
}

interface Props {
  logs: ActivityLog[];
  showWebsite?: boolean;
}

export function ActivityLogTable({ logs, showWebsite }: Props) {
  if (logs.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
        No activity logged yet.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
              Action
            </th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
              Entity
            </th>
            {showWebsite && (
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
                Website
              </th>
            )}
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
              User
            </th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground whitespace-nowrap">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <Badge variant={actionVariant(log.action)}>
                  {ACTION_LABELS[log.action] ?? log.action}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                {log.entity_label || log.entity_id || "—"}
              </td>
              {showWebsite && (
                <td className="px-4 py-3 text-muted-foreground">
                  {log.website?.name ?? "—"}
                </td>
              )}
              <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">
                {log.user_email || "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                {formatDate(log.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
