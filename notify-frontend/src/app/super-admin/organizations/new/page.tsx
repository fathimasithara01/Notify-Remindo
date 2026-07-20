'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { organizationApi } from '@/lib/api/organizations';
import { subscriptionApi } from '@/lib/api/subscriptions';
import { ApiClientError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const createOrgSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    contactEmail: z.string().email('Enter a valid email address'),
    contactPhone: z.string().min(1, 'Contact phone is required'),
    address: z.string().optional(),
    planId: z.string().min(1, 'Select a plan'),
});

type CreateOrgFormValues = z.infer<typeof createOrgSchema>;

export default function NewOrganizationPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: plansResponse, isLoading: plansLoading } = useQuery({
        queryKey: ['subscriptions', 'plans', 'active'],
        queryFn: () => subscriptionApi.listPlans('active'),
    });

    const plans = plansResponse?.items ?? [];

    const form = useForm<CreateOrgFormValues>({
        resolver: zodResolver(createOrgSchema),
        defaultValues: { name: '', contactEmail: '', contactPhone: '', address: '', planId: '' },
    });

    const createMutation = useMutation({
        mutationFn: organizationApi.create,
        onSuccess: (org) => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
            toast.success('Organization created');
            router.push(`/super-admin/organizations/${org.id}`);
        },
        onError: (error: ApiClientError) => toast.error(error.message),
    });

    const onSubmit = (values: CreateOrgFormValues) => {
        createMutation.mutate(values);
    };

    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">New Organization</h1>
                <p className="text-sm text-muted-foreground">Onboard a new subscribing organization.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Organization Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organization Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ABC" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contactEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="contact@ABC.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contactPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+91" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Business address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="planId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subscription Plan</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={plansLoading ? 'Loading plans…' : 'Select a plan'}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {plans?.map((plan) => (
                                                    <SelectItem key={plan.id} value={plan.id}>
                                                        {plan.name} — {plan.userLimit} users / {plan.durationDays} days
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/super-admin/organizations')}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? 'Creating…' : 'Create Organization'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}