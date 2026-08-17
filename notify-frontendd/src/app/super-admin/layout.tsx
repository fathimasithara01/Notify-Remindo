'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Loader2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { NAV_ITEMS } from '@/config/nav-config';

function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isError, hasPermission } = useAuth();

  useEffect(() => {
    if (isError) {
      router.replace(ROUTES.login);
    }
  }, [isError, router]);

  useEffect(() => {
    if (isLoading || isError || !user) return;

    const matchedItem = NAV_ITEMS.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    );

    // if this route is guarded by a permission and the user doesn't have it, kick them out
    if (matchedItem?.permission && !hasPermission(matchedItem.permission)) {
      router.replace(ROUTES.dashboard); // or a dedicated /unauthorized page
    }
  }, [pathname, isLoading, isError, user, hasPermission, router]);

  if (isLoading) {
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