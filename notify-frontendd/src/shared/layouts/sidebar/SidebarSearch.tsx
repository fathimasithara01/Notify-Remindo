"use client";

import { Search } from "lucide-react";

type SidebarSearchProps = {
  collapsed: boolean;
};

export function SidebarSearch({
  collapsed,
}: SidebarSearchProps) {
  if (collapsed) {
    return null;
  }

  return (
    <div className="px-4 pb-3">
      <div className="group flex items-center gap-2 rounded-lg border border-sidebar-border bg-background/60 px-3 py-2 transition-colors focus-within:border-primary/40 focus-within:bg-background">
        <Search className="h-4 w-4 text-muted-foreground" />

        <input
          type="search"
          placeholder="Search..."
          aria-label="Search navigation"
          className="w-full bg-transparent text-sm text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        <kbd className="hidden rounded border border-sidebar-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}