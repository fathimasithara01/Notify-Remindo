'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CheckCircle2, XCircle, CreditCard, Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const { data: report, isLoading } = useQuery({
        queryKey: ['dashboard', 'report'],
        queryFn: dashboardApi.getReport,
    });

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Organizations',
            value: report?.totalOrganizations ?? 0,
            icon: Building2,
        },
        {
            label: 'Active Organizations',
            value: report?.activeOrganizations ?? 0,
            icon: CheckCircle2,
        },
        {
            label: 'Blocked Organizations',
            value: report?.blockedOrganizations ?? 0,
            icon: XCircle,
        },
        {
            label: 'Active Plans',
            value: report?.totalActivePlans ?? 0,
            icon: CreditCard,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Overview of organizations, plans, and account activity.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

        </div>
    );
}