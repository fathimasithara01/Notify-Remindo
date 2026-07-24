"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "./SidebarFooter";

export function PlatformSidebar() {
  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-out",
        collapsed
          ? "w-[76px]"
          : "w-[280px]",
      )}
      style={{
        fontFamily:
          "Inter, system-ui, sans-serif",
      }}
    >
      <SidebarHeader
        collapsed={collapsed}
      />

      <SidebarSearch
        collapsed={collapsed}
      />

      <SidebarNavigation
        collapsed={collapsed}
      />

      <SidebarFooter
        collapsed={collapsed}
        onToggle={() =>
          setCollapsed(
            (value) => !value,
          )
        }
      />
    </aside>
  );
}