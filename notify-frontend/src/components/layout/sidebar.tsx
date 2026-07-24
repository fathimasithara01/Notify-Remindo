'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, ShieldCheck, KeyRound, CreditCard, Bell, LogOut, } from 'lucide-react';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AuthUser } from '@/lib/types/auth';

const NAV_ITEMS = [
    { href: '/super-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/super-admin/organizations', label: 'Organizations', icon: Building2 },
    { href: '/super-admin/roles', label: 'Roles', icon: ShieldCheck },
    { href: '/super-admin/permissions', label: 'Permissions', icon: KeyRound },
    { href: '/super-admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { href: '/super-admin/notifications', label: 'Notifications', icon: Bell },
];

interface Prop {
    user: AuthUser
}

export function Sidebar({ user }: Prop) {
    const pathname = usePathname();

    const logout = useLogout();

    return (
        <aside className="flex h-screen w-64 flex-col border-r bg-card">
            <div className="border-b px-6 py-5">
                <h1 className="text-lg font-semibold">Notify</h1>
                <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t px-3 py-4">
                {user && (
                    <div className="mb-3 px-3">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                )}
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground"
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </Button>
            </div>
        </aside>
    );
}