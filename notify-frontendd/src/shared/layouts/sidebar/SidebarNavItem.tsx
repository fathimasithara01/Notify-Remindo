"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {  SidebarLeafItem } from "@/config/navigation";

type SidebarNavItemProps = {
  item: SidebarLeafItem;
  collapsed: boolean;
  active: boolean;
};

function Badge({
  children,
  tone = "solid",
}: {
  children: React.ReactNode;
  tone?: "solid" | "soft";
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
        tone === "solid"
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function SidebarNavItem({
  item,
  collapsed,
  active,
}: SidebarNavItemProps) {
  return (
    <Link
      href={item.to}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        collapsed && "justify-center",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
      )}

      <span className="h-[18px] w-[18px] shrink-0" />

      {!collapsed && (
        <>
          <span className="flex-1 truncate">
            {item.label}
          </span>

          {item.badge && (
            <Badge>{item.badge}</Badge>
          )}
        </>
      )}
    </Link>
  );
}