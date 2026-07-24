"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarHeaderProps = {
  collapsed: boolean;
};

export function SidebarHeader({
  collapsed,
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-5 pt-5 pb-4",
        collapsed && "justify-center px-3",
      )}
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-brand">
        <Bell
          className="h-5 w-5 text-primary-foreground"
          strokeWidth={2.5}
        />

        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
      </div>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[15px] font-semibold tracking-tight text-sidebar-foreground">
              Notify
            </p>

            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Admin
            </span>
          </div>

          <p className="truncate text-xs text-muted-foreground">
            SaaS Management
          </p>
        </div>
      )}
    </div>
  );
}