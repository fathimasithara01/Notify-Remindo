'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Loader2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { NAV_ITEMS } from '@/config/nav-config';

function isPathMatch(pathname: string, href: string) {
  // exact match, or a proper sub-path (segment boundary, not string prefix)
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isError, hasPermission } = useAuth();
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (isError) {
      router.replace(ROUTES.login);
    }
  }, [isError, router]);

  useEffect(() => {
    if (isLoading || isError || !user) return;

    // never guard the unauthorized page itself — avoids any redirect loop
    if (pathname === ROUTES.unauthorized) {
      setCheckingAccess(false);
      return;
    }

    // longest matching href wins, in case of overlapping prefixes
    const matchedItem = [...NAV_ITEMS]
      .filter((item) => isPathMatch(pathname, item.href))
      .sort((a, b) => b.href.length - a.href.length)[0];

    if (matchedItem?.permission && !hasPermission(matchedItem.permission)) {
      router.replace(ROUTES.unauthorized);
      return; // don't render children while redirecting
    }

    setCheckingAccess(false);
  }, [pathname, isLoading, isError, user, hasPermission, router]);

  if (isLoading || checkingAccess) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-start">
      <div className="sticky top-0 h-screen shrink-0">
        <Sidebar />
      </div>
      <main className="min-w-0 flex-1 bg-muted/20 p-8">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}