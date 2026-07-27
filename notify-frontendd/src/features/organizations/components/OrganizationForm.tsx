'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCreateOrganization } from '../hooks/useOrganizationMutations';
import { usePlans } from '@/features/subscriptions/hooks/usePlans';
import {
  createOrganizationSchema,
  CreateOrganizationFormValues,
} from '../schemas/organization.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';

export function OrganizationForm() {
  const router = useRouter();
  const createMutation = useCreateOrganization();
  const { data: plansData, isLoading: plansLoading } = usePlans('active');

  const form = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: { name: '', contactEmail: '', contactPhone: '', address: '', planId: '' },
  });

  const onSubmit = (values: CreateOrganizationFormValues) => {
    createMutation.mutate(values);
  };

  return (
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
                    <Input placeholder="Acme Trading LLC" {...field} />
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
                    <Input type="email" placeholder="contact@acme.com" {...field} />
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
                    <Input placeholder="+971 50 123 4567" {...field} />
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
                      {plansData?.items.map((plan) => (
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
                onClick={() => router.push(ROUTES.organizations.list)}
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
  );
}   