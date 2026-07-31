"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  ChevronDown,
  LogOut,
} from "lucide-react";

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
      aria-current={
        isActive ? "page" : undefined
      }
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

          !isActive &&
            "text-muted-foreground group-hover:text-accent-foreground"
        )}
      />

      <span className="truncate">
        {label}
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const { user } = useAuth();

  const logout = useLogout();

  /*
   * -------------------------------------------------------
   * Subscription navigation state
   * -------------------------------------------------------
   */

  const subscriptionRoutes = [
    ROUTES.subscriptions.plans,
    ROUTES.subscriptions.features,
    ROUTES.subscriptions.planFeatures,
    ROUTES.subscriptions.organizationSubscriptions,
  ];

  const subscriptionActive =
    subscriptionRoutes.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`)
    );

  const [
    subscriptionOpen,
    setSubscriptionOpen,
  ] = useState(subscriptionActive);

  /*
   * -------------------------------------------------------
   * Sidebar
   * -------------------------------------------------------
   */

  return (
    <aside
      className="
        flex
        h-screen
        w-64
        shrink-0
        flex-col
        border-r
        bg-card
      "
    >
      {/* ================================================= */}
      {/* BRAND */}
      {/* ================================================= */}

      <div
        className="
          flex
          h-16
          shrink-0
          items-center
          border-b
          px-5
        "
      >
        <Link
          href={ROUTES.dashboard}
          className="flex items-center gap-3"
        >
          {/* Logo */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-primary
              text-sm
              font-bold
              text-primary-foreground
            "
          >
            {APP_NAME
              .charAt(0)
              .toUpperCase()}
          </div>

          {/* Application name */}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {APP_NAME}
            </p>

            <p className="text-xs text-muted-foreground">
              Super Admin
            </p>
          </div>
        </Link>
      </div>

      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <nav
        className="
          flex-1
          overflow-y-auto
          px-3
          py-4
        "
      >
        {/* ================================================= */}
        {/* OVERVIEW */}
        {/* ================================================= */}

        <SidebarSection title="Overview">
          <SidebarItem
            href={ROUTES.dashboard}
            label="Dashboard"
            icon={LayoutDashboard}
            pathname={pathname}
          />

          <SidebarItem
            href={ROUTES.organizations.list}
            label="Organizations"
            icon={Building2}
            pathname={pathname}
          />
        </SidebarSection>

        {/* ================================================= */}
        {/* ADMINISTRATION */}
        {/* ================================================= */}

        <SidebarSection title="Administration">
          <SidebarItem
            href={ROUTES.roles.list}
            label="Roles"
            icon={ShieldCheck}
            pathname={pathname}
          />

          <SidebarItem
            href={ROUTES.permissions}
            label="Permissions"
            icon={KeyRound}
            pathname={pathname}
          />

          <SidebarItem
            href={ROUTES.users.list}
            label="Admin Users"
            icon={Users}
            pathname={pathname}
          />
        </SidebarSection>

        {/* ================================================= */}
        {/* SUBSCRIPTIONS */}
        {/* ================================================= */}

        <div className="mt-7">
          <button
            type="button"
            aria-expanded={
              subscriptionOpen
            }
            onClick={() =>
              setSubscriptionOpen(
                (previous) =>
                  !previous
              )
            }
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",

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
                "h-4 w-4 transition-transform duration-200",

                subscriptionOpen &&
                  "rotate-180"
              )}
            />
          </button>

          {subscriptionOpen && (
            <div
              className="
                ml-3
                mt-1
                space-y-1
                border-l
                pl-3
              "
            >
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
                  ROUTES.subscriptions.planFeatures
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

        {/* ================================================= */}
        {/* PLATFORM */}
        {/* ================================================= */}

        <SidebarSection title="Platform">
          <SidebarItem
            href={ROUTES.notifications}
            label="Notifications"
            icon={Bell}
            pathname={pathname}
          />

          <SidebarItem
            href={ROUTES.invites}
            label="Invites"
            icon={Mail}
            pathname={pathname}
          />

          <SidebarItem
            href={ROUTES.audit}
            label="Audit Log"
            icon={ScrollText}
            pathname={pathname}
          />
        </SidebarSection>
      </nav>

      {/* ================================================= */}
      {/* USER FOOTER */}
      {/* ================================================= */}

      <div
        className="
          shrink-0
          border-t
          p-3
        "
      >
        {user && (
          <div
            className="
              mb-2
              rounded-lg
              bg-muted/50
              px-3
              py-2.5
            "
          >
            <p className="truncate text-sm font-medium">
              {user.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          className="
            w-full
            justify-start
            gap-3
            text-muted-foreground
            hover:text-destructive
          "
          onClick={() =>
            logout.mutate()
          }
          disabled={logout.isPending}
        >
          <LogOut className="h-4 w-4" />

          <span>
            {logout.isPending
              ? "Logging out..."
              : "Log out"}
          </span>
        </Button>
      </div>
    </aside>
  );
}

/*
 * =========================================================
 * Sidebar Section
 * =========================================================
 */

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">
      <div className="mb-3 px-3">
        <p
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-wider
            text-muted-foreground
          "
        >
          {title}
        </p>
      </div>

      <div className="space-y-1">
        {children}
      </div>
    </section>
  );
}