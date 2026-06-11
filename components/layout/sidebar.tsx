"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Globe,
  FileText,
  Newspaper,
  Image,
  Settings,
  Settings2,
  LogOut,
  ChevronLeft,
  Users,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Profile } from "@/types";

interface SidebarProps {
  profile: Profile;
  websites?: { name: string; slug: string }[];
}

export function Sidebar({ profile, websites = [] }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const websiteSlug = params?.websiteSlug as string | undefined;

  function handleLogout() {
    window.location.href = "/api/auth/signout";
  }

  const globalNav = [
    { href: "/dashboard", label: "All Websites", icon: LayoutDashboard },
    ...(profile.role === "admin"
      ? [{ href: "/dashboard/activity", label: "Activity", icon: History }]
      : []),
    { href: "/dashboard/settings", label: "Team", icon: Users },
  ];

  const websiteNav = websiteSlug
    ? [
        {
          href: `/dashboard/${websiteSlug}`,
          label: "Overview",
          icon: Globe,
          exact: true,
        },
        {
          href: `/dashboard/${websiteSlug}/pages`,
          label: "Pages",
          icon: FileText,
        },
        {
          href: `/dashboard/${websiteSlug}/blogs`,
          label: "Blog",
          icon: Newspaper,
        },
        {
          href: `/dashboard/${websiteSlug}/media`,
          label: "Media",
          icon: Image,
        },
        {
          href: `/dashboard/${websiteSlug}/activity`,
          label: "Activity",
          icon: History,
        },
        {
          href: `/dashboard/${websiteSlug}/settings`,
          label: "Settings",
          icon: Settings2,
        },
      ]
    : [];

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const initials = (profile.full_name || profile.email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="flex h-screen w-56 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 border-b">
        <span className="font-semibold text-sm tracking-tight">Desun CMS</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {/* Back to all websites when in a specific website */}
        {websiteSlug && (
          <>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors mb-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              All Websites
            </Link>
            <div className="px-2 py-1 mb-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                {websites.find((w) => w.slug === websiteSlug)?.name || websiteSlug}
              </p>
            </div>
            {websiteNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                    isActive(item.href, item.exact)
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            <Separator className="my-2" />
          </>
        )}

        {/* Global nav */}
        {!websiteSlug &&
          globalNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                  isActive(item.href, item.href === "/dashboard")
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}

        {websiteSlug && (
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
              isActive("/dashboard/settings")
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Users className="h-4 w-4 shrink-0" />
            Team
          </Link>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t p-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{profile.full_name || profile.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
