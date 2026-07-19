'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { organizationApi } from '@/lib/api/organizations';
import { ApiClientError } from '@/lib/api/client';
import { Organization } from '@/lib/types/organization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const editOrgSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactEmail: z.string().email('Enter a valid email address'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address: z.string().optional(),
});

type EditOrgFormValues = z.infer<typeof editOrgSchema>;

interface EditOrganizationDialogProps {
  organization: Organization | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditOrganizationDialog({
  organization,
  open,
  onOpenChange,
}: EditOrganizationDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<EditOrgFormValues>({
    resolver: zodResolver(editOrgSchema),
    defaultValues: { name: '', contactEmail: '', contactPhone: '', address: '' },
  });

  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name,
        contactEmail: organization.contactEmail,
        contactPhone: organization.contactPhone,
        address: organization.address ?? '',
      });
    }
  }, [organization, form]);

  const updateMutation = useMutation({
    mutationFn: (values: EditOrgFormValues) => {
      if (!organization) throw new Error('No organization selected');
      return organizationApi.update(organization.id, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organization updated');
      onOpenChange(false);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
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
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input type="email" {...field} />
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
                    <Input {...field} />
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