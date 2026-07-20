'use client';

import { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { organizationApi } from '@/lib/api/organizations';
import { subscriptionApi } from '@/lib/api/subscriptions';
import { ApiClientError } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function OrganizationDetailPage({ params, }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const queryClient = useQueryClient();

    const { data: organization, isLoading } = useQuery({
        queryKey: ['organizations', id],
        queryFn: () => organizationApi.getOne(id),
    });

    const { data: plansResponse } = useQuery({
        queryKey: ['subscriptions', 'plans', 'active'],
        queryFn: () => subscriptionApi.listPlans('active'),
    });

    const upgradeMutation = useMutation({
        mutationFn: (newPlanId: string) => organizationApi.upgradePlan(id, newPlanId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations', id] });
            toast.success('Plan upgraded');
        },
        onError: (error: ApiClientError) => toast.error(error.message),
    });

    const plans = plansResponse?.items ?? [];

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!organization) {
        return <p className="text-muted-foreground">Organization not found.</p>;
    }

    const currentPlan = plans.find((p) => p.id === organization.currentPlanId);

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{organization.name}</h1>
                    <p className="text-sm text-muted-foreground">{organization.contactEmail}</p>
                </div>
                <Badge variant={organization.status === 'active' ? 'default' : 'destructive'}>{organization.status}</Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Contact Phone</p>
                        <p className="font-medium">{organization.contactPhone}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Address</p>
                        <p className="font-medium">{organization.address || '—'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">{new Date(organization.createdAt).toLocaleDateString()}</p>
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
                                {plans
                                    .filter((p) => p.id !== organization.currentPlanId)
                                    .map((plan) => (
                                        <SelectItem key={plan.id} value={plan.id}>
                                            {plan.name} — {plan.userLimit} users
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        {upgradeMutation.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Contact Persons</CardTitle>
                </CardHeader>
                <CardContent>
                    {organization.contactPersons.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No contact persons added yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {organization.contactPersons.map((contact) => (
                                <li key={contact.id} className="text-sm">
                                    <p className="font-medium">{contact.name}</p>
                                    <p className="text-muted-foreground">
                                        {contact.designation && `${contact.designation} · `}
                                        {contact.phone}
                                        {contact.email && ` · ${contact.email}`}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}