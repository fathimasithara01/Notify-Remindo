'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subscriptionApi } from '@/lib/api/subscriptions';
import { ApiClientError } from '@/lib/api/client';
import { SubscriptionPlan } from '@/lib/types/subscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter} from '@/components/ui/dialog';
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

const editPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userLimit: z.coerce.number().int().positive('Must be a positive number'),
  durationDays: z.coerce.number().int().positive('Must be a positive number'),
  price: z.coerce.number().nonnegative('Cannot be negative').positive('Must be a positive number'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type EditPlanFormInput = z.input<typeof editPlanSchema>;
type EditPlanFormValues = z.output<typeof editPlanSchema>;

interface EditPlanDialogProps {
  plan: SubscriptionPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPlanDialog({ plan, open, onOpenChange }: EditPlanDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<EditPlanFormInput, any, EditPlanFormValues>({
    resolver: zodResolver(editPlanSchema),
    defaultValues: {
      name: '',
      userLimit: 1,
      durationDays: 30,
      price: 0,
      description: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        userLimit: plan.userLimit,
        durationDays: plan.durationDays,
        price: plan.price,
        description: plan.description ?? '',
        status: plan.status,
      });
    }
  }, [plan, form]);

  const updateMutation = useMutation({
    mutationFn: (values: EditPlanFormValues) => {
      if (!plan) throw new Error('No plan selected');
      return subscriptionApi.updatePlan(plan.id, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'plans'] });
      toast.success('Plan updated');
      onOpenChange(false);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Plan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Limit</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value as number}  />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value as number} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} value={field.value as number}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}