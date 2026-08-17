import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';

export default function UnauthorizedPage() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <ShieldAlert className="h-12 w-12 text-muted-foreground" />
      <div>
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You don&apos;t have permission to view this page.
        </p>
      </div>
      <Button asChild>
        <Link href={ROUTES.dashboard}>Back to Dashboard</Link>
      </Button>
    </div>
  );
}