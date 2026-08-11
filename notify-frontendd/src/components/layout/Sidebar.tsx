"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CreditCard, ChevronDown, LogOut } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { useLogout } from "@/features/auth/hooks/useLogout";

import { ROUTES } from "@/config/routes";
import { APP_NAME } from "@/features/audit-log/constants/app";
import { NAV_ITEMS, type NavItem } from "@/config/nav-config";

import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  pathname: string;
}

function SidebarItem({ href, label, icon: Icon, pathname }: SidebarItemProps) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
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
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <div className="mb-3 px-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, hasPermission } = useAuth();
  const logout = useLogout();

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
    ROUTES.subscriptions.planFeatures,
    ROUTES.subscriptions.organizationSubscriptions,
  ].filter(canSee);

  const subscriptionActive = subscriptionRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const [subscriptionOpen, setSubscriptionOpen] = useState(subscriptionActive);

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-card">
      {/* BRAND */}
      <div className="flex h-16 shrink-0 items-center border-b px-5">
        <Link href={ROUTES.dashboard} className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            {APP_NAME.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{APP_NAME}</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {overviewItems.length > 0 && (
          <SidebarSection title="Overview">
            {overviewItems.map((href) => {
              const item = byHref(href)!;
              return (
                <SidebarItem key={href} href={href} label={item.label} icon={item.icon} pathname={pathname} />
              );
            })}
          </SidebarSection>
        )}

        {adminItems.length > 0 && (
          <SidebarSection title="Administration">
            {adminItems.map((href) => {
              const item = byHref(href)!;
              return (
                <SidebarItem key={href} href={href} label={item.label} icon={item.icon} pathname={pathname} />
              );
            })}
          </SidebarSection>
        )}

        {subscriptionRoutes.length > 0 && (
          <div className="mt-7">
            <button
              type="button"
              aria-expanded={subscriptionOpen}
              onClick={() => setSubscriptionOpen((previous) => !previous)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
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
                className={cn("h-4 w-4 transition-transform duration-200", subscriptionOpen && "rotate-180")}
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
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {platformItems.length > 0 && (
          <SidebarSection title="Platform">
            {platformItems.map((href) => {
              const item = byHref(href)!;
              return (
                <SidebarItem key={href} href={href} label={item.label} icon={item.icon} pathname={pathname} />
              );
            })}
          </SidebarSection>
        )}
      </nav>

      {/* USER FOOTER */}
      <div className="shrink-0 border-t p-3">
        {user && (
          <div className="mb-2 rounded-lg bg-muted/50 px-3 py-2.5">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut className="h-4 w-4" />
          <span>{logout.isPending ? "Logging out..." : "Log out"}</span>
        </Button>
      </div>
    </aside>
  );
}