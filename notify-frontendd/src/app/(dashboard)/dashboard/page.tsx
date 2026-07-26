import { StatCards } from '@/features/dashboard/components/StatCards';

export default function DashboardPage() {
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