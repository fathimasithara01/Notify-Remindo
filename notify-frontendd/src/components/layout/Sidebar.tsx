"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CreditCard,
  ChevronDown,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { useLogout } from "@/features/auth/hooks/useLogout";

import { ROUTES } from "@/config/routes";
import { APP_NAME } from "@/constants/app";
import { NAV_ITEMS, type NavItem } from "@/config/nav-config";

import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COLLAPSE_STORAGE_KEY = "sidebar:collapsed";

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  pathname: string;
  collapsed: boolean;
}

function SidebarItem({ href, label, icon: Icon, pathname, collapsed }: SidebarItemProps) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const link = (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm font-medium not-italic transition-colors",
        collapsed && "justify-center px-2",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          !isActive && "text-muted-foreground group-hover:text-accent-foreground"
        )}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarSection({
  title,
  collapsed,
  children,
}: {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">
      {!collapsed && (
        <div className="mb-3 px-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function initials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, hasPermission } = useAuth();
  const logout = useLogout();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COLLAPSE_STORAGE_KEY);
    if (stored) setCollapsed(stored === "true");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem(COLLAPSE_STORAGE_KEY, String(!prev));
      return !prev;
    });
  };

  const byHref = (href: string): NavItem | undefined =>
    NAV_ITEMS.find((item) => item.href === href);

  // Single source of truth for visibility: no permission on the item = always
  // shown; otherwise it must be in the logged-in user's permission set.
  const canSee = (href: string) => {
    const item = byHref(href);
    if (!item) return false;
    if (!item.permission) return true;
    return hasPermission(item.permission);
  };

  const overviewItems = [ROUTES.dashboard, ROUTES.organizations.list].filter(canSee);
  const adminItems = [ROUTES.roles.list, ROUTES.users.list].filter(canSee);
  const platformItems = [ROUTES.notifications, ROUTES.invites, ROUTES.audit].filter(canSee);

  const subscriptionRoutes = [
    ROUTES.subscriptions.plans,
    ROUTES.subscriptions.features,
  ].filter(canSee);

  const subscriptionActive = subscriptionRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const [subscriptionOpen, setSubscriptionOpen] = useState(subscriptionActive);

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex h-full shrink-0 flex-col border-r bg-card transition-[width] duration-200",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* BRAND */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <Link href={ROUTES.dashboard} className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              {APP_NAME.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{APP_NAME}</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
              </div>
            )}
          </Link>

          {!collapsed && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground"
              onClick={toggleCollapsed}
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>

        {collapsed && (
          <div className="flex justify-center border-b py-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={toggleCollapsed}
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {overviewItems.length > 0 && (
            <SidebarSection title="Overview" collapsed={collapsed}>
              {overviewItems.map((href) => {
                const item = byHref(href)!;
                return (
                  <SidebarItem
                    key={href}
                    href={href}
                    label={item.label}
                    icon={item.icon}
                    pathname={pathname}
                    collapsed={collapsed}
                  />
                );
              })}
            </SidebarSection>
          )}

          {adminItems.length > 0 && (
            <SidebarSection title="Administration" collapsed={collapsed}>
              {adminItems.map((href) => {
                const item = byHref(href)!;
                return (
                  <SidebarItem
                    key={href}
                    href={href}
                    label={item.label}
                    icon={item.icon}
                    pathname={pathname}
                    collapsed={collapsed}
                  />
                );
              })}
            </SidebarSection>
          )}

          {subscriptionRoutes.length > 0 && (
            <div className="mt-7">
              {collapsed ? (
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Link
                      href={subscriptionRoutes[0]}
                      className={cn(
                        "flex items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-colors",
                        subscriptionActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <CreditCard className="h-4 w-4 shrink-0" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Subscription Management</TooltipContent>
                </Tooltip>
              ) : (
                <>
                  <button
                    type="button"
                    aria-expanded={subscriptionOpen}
                    onClick={() => setSubscriptionOpen((previous) => !previous)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-sans text-sm font-medium not-italic transition-colors",
                      subscriptionActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 shrink-0" />
                      <span>Subscription Management</span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        subscriptionOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {subscriptionOpen && (
                    <div className="ml-3 mt-1 space-y-1 border-l pl-3">
                      {subscriptionRoutes.map((href) => {
                        const item = byHref(href)!;
                        return (
                          <SidebarItem
                            key={href}
                            href={href}
                            label={item.label}
                            icon={item.icon}
                            pathname={pathname}
                            collapsed={false}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {platformItems.length > 0 && (
            <SidebarSection title="Platform" collapsed={collapsed}>
              {platformItems.map((href) => {
                const item = byHref(href)!;
                return (
                  <SidebarItem
                    key={href}
                    href={href}
                    label={item.label}
                    icon={item.icon}
                    pathname={pathname}
                    collapsed={collapsed}
                  />
                );
              })}
            </SidebarSection>
          )}
        </nav>

        {/* USER FOOTER */}
        <div className="shrink-0 border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent",
                  collapsed && "justify-center px-0"
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initials(user?.name)}
                </div>
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
              <div className="px-2 py-1.5">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.dashboard} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Account settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                disabled={logout.isPending}
                onClick={() => logout.mutate()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {logout.isPending ? "Logging out..." : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  );
}