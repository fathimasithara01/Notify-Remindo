"use client";

import { Sparkles } from "lucide-react";

export function SidebarStatusCard() {
  return (
    <div className="mt-6 rounded-xl border border-sidebar-border bg-gradient-to-br from-primary/5 via-background to-background p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>

        <p className="text-sm font-semibold text-sidebar-foreground">
          Platform Health
        </p>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        All systems operational.
        99.98% uptime this month.
      </p>

      <button
        type="button"
        className="mt-3 text-xs font-medium text-primary hover:underline"
      >
        View status →
      </button>
    </div>
  );
}