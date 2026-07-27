'use client';

import { useOrganization } from '../hooks/useOrganization';
import { useUpgradePlan } from '../hooks/useOrganizationMutations';
import { usePlans } from '@/features/subscriptions/hooks/usePlans';
import { ContactPersonList } from './ContactPersonList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingState } from '@/components/common/LoadingState';
import { Loader } from '@/components/common/Loader';
import { formatDate } from '@/lib/utils/format-date';

export function OrganizationDetail({ id }: { id: string }) {
  const { data: org, isLoading } = useOrganization(id);
  const { data: plansData } = usePlans('active');
  const upgradeMutation = useUpgradePlan(id);

  if (isLoading) return <LoadingState />;
  if (!org) return <p className="text-muted-foreground">Organization not found.</p>;

  const currentPlan = plansData?.items.find((p) => p.id === org.currentPlanId);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{org.name}</h1>
          <p className="text-sm text-muted-foreground">{org.contactEmail}</p>
        </div>
        <Badge variant={org.status === 'active' ? 'default' : 'destructive'}>{org.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Contact Phone</p>
            <p className="font-medium">{org.contactPhone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Address</p>
            <p className="font-medium">{org.address || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">{formatDate(org.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Current plan: <span className="font-medium">{currentPlan?.name ?? '—'}</span>
          </p>
          <div className="flex items-center gap-2">
            <Select onValueChange={(value) => upgradeMutation.mutate(value)}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Change plan…" />
              </SelectTrigger>
              <SelectContent>
                {plansData?.items
                  .filter((p) => p.id !== org.currentPlanId)
                  .map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} — {plan.userLimit} users
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {upgradeMutation.isPending && <Loader className="h-4 w-4" />}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Persons</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactPersonList organizationId={org.id} contacts={org.contactPersons} />
        </CardContent>
      </Card>
    </div>
  );
}