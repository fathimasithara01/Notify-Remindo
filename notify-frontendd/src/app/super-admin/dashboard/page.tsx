'use client';

import { useAuth } from '@/providers/AuthProvider';
import { PERMISSIONS } from '@/config/permissions';
import { StatCards } from '@/features/dashboard/components/StatCards';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
    const { hasPermission, isLoading } = useAuth();

    if (isLoading) return null; 

    if (!hasPermission(PERMISSIONS.DASHBOARD_VIEW)) {
        redirect('/super-admin/unauthorized'); 
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Overview of organizations, plans, and account activity.
                </p>
            </div>

            <StatCards />
        </div>
    );
}