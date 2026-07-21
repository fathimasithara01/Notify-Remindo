'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subscriptionApi } from '@/lib/api/subscriptions';
import { SubscriptionPlan } from '@/lib/types/subscription';
import { ApiClientError } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreatePlanDialog } from '@/components/subscriptions/create-plan-dialog';
import { EditPlanDialog } from '@/components/subscriptions/edit-plan-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Loader2, Pencil, Trash2 } from 'lucide-react';

export default function SubscriptionsPage() {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions', 'plans'],
    queryFn: () => subscriptionApi.listPlans(),
  });

  const deleteMutation = useMutation({
    mutationFn: subscriptionApi.deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'plans'] });
      toast.success('Plan deleted');
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Subscription Plans</h1>
          <p className="text-sm text-muted-foreground">
            Manage the plans organizations can subscribe to.
          </p>
        </div>
        <CreatePlanDialog />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((plan) => (
            <Card key={plan.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  {plan.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>
                  )}
                </div>
                <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                  {plan.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">
                  {plan.price}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {plan.durationDays} days
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Up to {plan.userLimit} users</p>
                <div className="flex justify-end gap-1 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingPlan(plan)}>
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    }
                    title="Delete this plan?"
                    description={`"${plan.name}" will be marked inactive. Organizations currently on this plan keep their access until they're moved to another plan.`}
                    onConfirm={() => deleteMutation.mutate(plan.id)}
                    isPending={deleteMutation.isPending}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EditPlanDialog
        plan={editingPlan}
        open={!!editingPlan}
        onOpenChange={(open) => !open && setEditingPlan(null)}
      />
    </div>
  );
}