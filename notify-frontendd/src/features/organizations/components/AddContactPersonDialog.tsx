'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { organizationApi } from '../api/organization.api';
import {
  contactPersonSchema,
  ContactPersonFormValues,
} from '../schemas/organization.schema';

import { queryKeys } from '@/lib/query/query-keys';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Plus } from 'lucide-react';

interface AddContactPersonDialogProps {
  organizationId: string;
}

export function AddContactPersonDialog({
  organizationId,
}: AddContactPersonDialogProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<ContactPersonFormValues>({
    resolver: zodResolver(contactPersonSchema),
    defaultValues: {
      name: '',
      designation: '',
      contactEmail: '',
      contactPhone: '',
    },
  });

  const addContactMutation = useMutation({
    mutationFn: (values: ContactPersonFormValues) =>
      organizationApi.addContactPerson(organizationId, {
        name: values.name,
        designation: values.designation,
        contactEmail: values.contactEmail || undefined,
        contactPhone: values.contactPhone || undefined,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.contacts(organizationId),
      });

      toast.success('Contact person added successfully.');

      form.reset();
      setOpen(false);
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add contact person.');
    },
  });

  const onSubmit = (values: ContactPersonFormValues) => {
    addContactMutation.mutate(values);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value && !addContactMutation.isPending) {
      form.reset();
    }

    setOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Contact Person</DialogTitle>

          <DialogDescription>
            Add a contact person associated with this organization.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name
                    <span className="text-destructive"> *</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter full name"
                      disabled={addContactMutation.isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="HR Manager"
                      disabled={addContactMutation.isPending}
                      {...field}
                    />
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
                  <FormLabel>Email Address</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@company.com"
                      disabled={addContactMutation.isPending}
                      {...field}
                    />
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
                  <FormLabel>Phone Number</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="+971 50 123 4567"
                      disabled={addContactMutation.isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={addContactMutation.isPending}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={addContactMutation.isPending}
              >
                {addContactMutation.isPending
                  ? 'Adding...'
                  : 'Add Contact Person'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}