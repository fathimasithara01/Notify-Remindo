"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LogOut,
} from "lucide-react";

import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  KeyRound,
  CreditCard,
  Bell,
  Users,
  Mail,
  ScrollText,
} from "lucide-react";

import { useState } from "react";

import { useAuth } from "@/providers/AuthProvider";
import { useLogout } from "@/features/auth/hooks/useLogout";

import { ROUTES } from "@/config/routes";

import { APP_NAME } from "@/constants/app";

import { cn } from "@/lib/utils/utils";

import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  pathname: string;
}

function SidebarItem({
  href,
  label,
  icon: Icon,
  pathname,
}: SidebarItemProps) {
  const isActive =
    pathname === href ||
    pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />

      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const { user } = useAuth();

  const logout = useLogout();

  const subscriptionActive =
    pathname.startsWith(
      "/super-admin/subscription-plans"
    ) ||
    pathname.startsWith(
      "/super-admin/subscription-features"
    ) ||
    pathname.startsWith(
      "/super-admin/plan-features"
    ) ||
    pathname.startsWith(
      "/super-admin/organization-subscriptions"
    );

  const [
    subscriptionOpen,
    setSubscriptionOpen,
  ] = useState(subscriptionActive);

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}

      <div className="border-b px-6 py-5">
        <h1 className="text-lg font-semibold">
          {APP_NAME}
        </h1>

        <p className="text-xs text-muted-foreground">
          Super Admin
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {/* Dashboard */}

        <SidebarItem
          href={ROUTES.dashboard}
          label="Dashboard"
          icon={LayoutDashboard}
          pathname={pathname}
        />

        {/* Organizations */}

        <SidebarItem
          href={ROUTES.organizations.list}
          label="Organizations"
          icon={Building2}
          pathname={pathname}
        />

        {/* Roles */}

        <SidebarItem
          href={ROUTES.roles.list}
          label="Roles"
          icon={ShieldCheck}
          pathname={pathname}
        />

        {/* Permissions */}

        <SidebarItem
          href={ROUTES.permissions}
          label="Permissions"
          icon={KeyRound}
          pathname={pathname}
        />

        {/* Subscription Management */}

        <div className="pt-2">
          <button
            type="button"
            onClick={() =>
              setSubscriptionOpen(
                (previous) => !previous
              )
            }
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
              subscriptionActive
                ? "text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <span className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 shrink-0" />

              <span>
                Subscription Management
              </span>
            </span>

            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                subscriptionOpen &&
                  "rotate-180"
              )}
            />
          </button>

          {subscriptionOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l pl-3">
              <SidebarItem
                href={
                  ROUTES.subscriptions.plans
                }
                label="Subscription Plans"
                icon={CreditCard}
                pathname={pathname}
              />

              <SidebarItem
                href={
                  ROUTES.subscriptions.features
                }
                label="Features"
                icon={KeyRound}
                pathname={pathname}
              />

              <SidebarItem
                href={
                  ROUTES.subscriptions
                    .planFeatures
                }
                label="Plan Features"
                icon={CreditCard}
                pathname={pathname}
              />

              <SidebarItem
                href={
                  ROUTES.subscriptions
                    .organizationSubscriptions
                }
                label="Organization Subscriptions"
                icon={Building2}
                pathname={pathname}
              />
            </div>
          )}
        </div>

        {/* Notifications */}

        <SidebarItem
          href={ROUTES.notifications}
          label="Notifications"
          icon={Bell}
          pathname={pathname}
        />

        {/* Admin Users */}

        <SidebarItem
          href={ROUTES.users.list}
          label="Admin Users"
          icon={Users}
          pathname={pathname}
        />

        {/* Invites */}

        <SidebarItem
          href={ROUTES.invites}
          label="Invites"
          icon={Mail}
          pathname={pathname}
        />

        {/* Audit Log */}

        <SidebarItem
          href={ROUTES.audit}
          label="Audit Log"
          icon={ScrollText}
          pathname={pathname}
        />
      </nav>

      {/* User / Logout */}

      <div className="border-t px-3 py-4">
        {user && (
          <div className="mb-3 px-3">
            <p className="truncate text-sm font-medium">
              {user.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          className="
            w-full
            justify-start
            gap-3
            text-muted-foreground
          "
          onClick={() =>
            logout.mutate()
          }
          disabled={logout.isPending}
        >
          <LogOut className="h-4 w-4" />

          {logout.isPending
            ? "Logging out..."
            : "Log out"}
        </Button>
      </div>
    </aside>
  );
}