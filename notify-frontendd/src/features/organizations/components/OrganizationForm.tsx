'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { useCreateOrganization } from '../hooks/useOrganizationMutations';
import { useSubscriptionPlans } from '@/features/subscription/hooks/use-subscription-plans';
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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';


import { ROUTES } from '@/config/routes';

export function OrganizationForm() {
  const router = useRouter();

  const createMutation = useCreateOrganization();

  const {
    data: plansData,
    isLoading: plansLoading,
  } = useSubscriptionPlans({
    page: 1,
    limit: 100,
    status: "active",
  });

  const form = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),

    defaultValues: {
      name: '',
      businessEmail: '',
      businessPhone: '',
      address: '',
      planId: '',

      admin: {
        name: '',
        email: '',
        phone: '',
      },
    },
  });

  const onSubmit = (values: CreateOrganizationFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Organization
        </h1>

        <p className="text-sm text-muted-foreground">
          Create a new organization and assign its primary administrator.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* ================================================= */}
          {/* BUSINESS DETAILS */}
          {/* ================================================= */}

          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>

              <CardDescription>
                Enter the basic information of the organization.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* Organization Name */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Organization Name
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="e.g. Tech Solutions Pvt Ltd"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Email */}

              <FormField
                control={form.control}
                name="businessEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Email
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="email"
                        placeholder="info@company.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Phone */}

              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Phone
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+91 9876543210"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Business Address
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter business address"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ================================================= */}
          {/* ORGANIZATION ADMIN */}
          {/* ================================================= */}

          <Card>
            <CardHeader>
              <CardTitle>
                Organization Administrator
              </CardTitle>

              <CardDescription>
                This person will receive the invitation email and
                become the primary administrator of this organization.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-md border bg-muted/40 p-4">
                <p className="text-sm font-medium">
                  Primary Organization Admin
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  The administrator can log in, manage organization
                  users, and access organization-level features.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Admin Name */}

                <FormField
                  control={form.control}
                  name="admin.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="e.g. John Doe"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Admin Phone */}

                <FormField
                  control={form.control}
                  name="admin.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone Number
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+91 9876543210"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Admin Email */}

                <FormField
                  control={form.control}
                  name="admin.email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Admin Login Email
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@company.com"
                          {...field}
                        />
                      </FormControl>

                      <p className="text-xs text-muted-foreground">
                        An invitation link will be sent to this email
                        address.
                      </p>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ================================================= */}
          {/* SUBSCRIPTION */}
          {/* ================================================= */}

          <Card>
            <CardHeader>
              <CardTitle>
                Subscription
              </CardTitle>

              <CardDescription>
                Select a subscription plan for the organization.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FormField
                control={form.control}
                name="planId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Subscription Plan
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              plansLoading
                                ? 'Loading plans...'
                                : 'Select a subscription plan'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {plansData?.items.map((plan) => (
                          <SelectItem
                            key={plan.id}
                            value={plan.id}
                          >
                            {plan.name} —{" "}
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: plan.currency,
                            }).format(plan.priceInMinorUnit / 100)}
                            {" • "}
                            {plan.billingInterval}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={createMutation.isPending}
              onClick={() =>
                router.push(ROUTES.organizations.list)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending
                ? 'Creating Organization...'
                : 'Create Organization'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
