"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarFooterProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function SidebarFooter({
  collapsed,
  onToggle,
}: SidebarFooterProps) {
  return (
    <div className="border-t border-sidebar-border p-3">
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent",
          collapsed && "justify-center",
        )}
      >
        <div className="relative">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-sm font-semibold text-primary-foreground">
            JS
          </div>

          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
        </div>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                John Smith
              </p>

              <p className="truncate text-xs text-muted-foreground">
                Super Admin
              </p>
            </div>

            <button
              type="button"
              title="Logout"
              aria-label="Logout"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {!collapsed && (
        <button
          type="button"
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Settings className="h-3.5 w-3.5" />
          Account Settings
        </button>
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-label={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
        className={cn(
          "mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
          collapsed && "justify-center",
        )}
      >
        {collapsed ? (
          <ChevronsRight className="h-4 w-4" />
        ) : (
          <>
            <ChevronsLeft className="h-4 w-4" />
            Collapse sidebar
          </>
        )}
      </button>
    </div>
  );
}