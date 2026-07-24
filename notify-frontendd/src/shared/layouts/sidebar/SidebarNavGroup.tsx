"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";

import type { SidebarGroupItem } from "@/config/navigation";

type SidebarNavGroupProps = {
  item: SidebarGroupItem;
  collapsed: boolean;
  pathname: string;
};

function isRouteActive(
  pathname: string,
  to: string,
) {
  return (
    pathname === to ||
    pathname.startsWith(`${to}/`)
  );
}

export function SidebarNavGroup({
  item,
  collapsed,
  pathname,
}: SidebarNavGroupProps) {
  const Icon: LucideIcon = item.icon;

  const anyActive =
    item.children?.some((child) =>
      isRouteActive(pathname, child.to),
    ) ?? false;

  const [isOpen, setIsOpen] =
    useState(anyActive);

  /*
   * Standalone navigation item
   *
   * Example:
   * Dashboard
   * Audit Logs
   */
  if (!item.children) {
    const active = item.to
      ? isRouteActive(pathname, item.to)
      : false;

    return (
      <Link
        href={item.to ?? "#"}
        aria-current={
          active ? "page" : undefined
        }
        title={
          collapsed
            ? item.label
            : undefined
        }
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

        <Icon
          className={cn(
            "h-[18px] w-[18px] shrink-0",

            active
              ? "text-primary"
              : "text-muted-foreground",
          )}
          strokeWidth={2}
        />

        {!collapsed && (
          <>
            <span className="flex-1 truncate">
              {item.label}
            </span>

            {item.badge && (
              <Badge>
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (value) => !value,
          )
        }
        aria-expanded={isOpen}
        title={
          collapsed
            ? item.label
            : undefined
        }
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",

          anyActive
            ? "text-sidebar-foreground"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",

          collapsed && "justify-center",
        )}
      >
        <Icon
          className={cn(
            "h-[18px] w-[18px] shrink-0",

            anyActive
              ? "text-primary"
              : "text-muted-foreground",
          )}
          strokeWidth={2}
        />

        {!collapsed && (
          <>
            <span className="flex-1 truncate text-left">
              {item.label}
            </span>

            {item.badge && (
              <Badge>
                {item.badge}
              </Badge>
            )}

            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",

                isOpen &&
                  "rotate-180",
              )}
            />
          </>
        )}
      </button>

      {!collapsed && (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-out",

            isOpen
              ? "grid-rows-[1fr]"
              : "grid-rows-[0fr]",
          )}
        >
          <ul className="ml-[22px] mt-0.5 space-y-0.5 overflow-hidden border-l border-sidebar-border pl-3">
            {item.children.map(
              (child) => {
                const active =
                  isRouteActive(
                    pathname,
                    child.to,
                  );

                return (
                  <li
                    key={child.to}
                  >
                    <Link
                      href={child.to}
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] transition-colors",

                        active
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      )}
                    >
                      <span className="flex-1 truncate">
                        {child.label}
                      </span>

                      {child.badge && (
                        <Badge tone="soft">
                          {child.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              },
            )}
          </ul>
        </div>
      )}
    </div>
  );
}