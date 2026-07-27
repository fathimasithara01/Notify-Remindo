import Link from 'next/link';
import { OrganizationTable } from '@/features/organizations/components/OrganizationTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/config/routes';

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organizations</h1>
          <p className="text-sm text-muted-foreground">
            Manage subscribing organizations (customers).
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.organizations.new}>
            <Plus className="mr-2 h-4 w-4" />
            New Organization
          </Link>
        </Button>
      </div>

      <OrganizationTable />
    </div>
  );
}