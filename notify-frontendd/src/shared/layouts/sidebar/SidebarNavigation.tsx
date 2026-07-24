"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { PLATFORM_NAVIGATION } from "@/config/navigation";

import { SidebarNavGroup } from "./SidebarNavGroup";
import { SidebarStatusCard } from "./SidebarStatusCard";

type SidebarNavigationProps = {
  collapsed: boolean;
};

export function SidebarNavigation({
  collapsed,
}: SidebarNavigationProps) {
  const pathname =
    usePathname();

  return (
    <nav
      aria-label="Platform navigation"
      className="flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:thin]"
    >
      {PLATFORM_NAVIGATION.map(
        (
          section,
          sectionIndex,
        ) => (
          <div
            key={
              section.heading ??
              "primary"
            }
            className={cn(
              sectionIndex > 0 &&
                "mt-5",
            )}
          >
            {section.heading &&
              !collapsed && (
                <p className="px-3 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80">
                  {section.heading}
                </p>
              )}

            <ul className="space-y-0.5">
              {section.items.map(
                (item) => (
                  <li
                    key={
                      item.label
                    }
                  >
                    <SidebarNavGroup
                      item={item}
                      collapsed={
                        collapsed
                      }
                      pathname={
                        pathname
                      }
                    />
                  </li>
                ),
              )}
            </ul>
          </div>
        ),
      )}

      {!collapsed && (
        <SidebarStatusCard />
      )}
    </nav>
  );
}