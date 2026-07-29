'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUpdateOrganization } from '../hooks/useOrganizationMutations';
import {
  editOrganizationSchema,
  EditOrganizationFormValues,
} from '../schemas/organization.schema';
import { Organization } from '../types/organization.types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

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
  const organizationId = organization?.id ?? '';

  const updateMutation = useUpdateOrganization(organizationId);

  const form = useForm<EditOrganizationFormValues>({
    resolver: zodResolver(editOrganizationSchema),

    defaultValues: {
      name: '',
      businessEmail: '',
      businessPhone: '',
      address: '',
    },
  });

  /**
   * Reset form whenever selected organization changes.
   */
  useEffect(() => {
    if (!organization) {
      form.reset({
        name: '',
        businessEmail: '',
        businessPhone: '',
        address: '',
      });

      return;
    }

    form.reset({
      name: organization.name,
      businessEmail: organization.businessEmail,
      businessPhone: organization.businessPhone,
      address: organization.address ?? '',
    });
  }, [organization, form]);

  /**
   * Submit organization changes.
   */
  const onSubmit = (values: EditOrganizationFormValues) => {
    if (!organizationId) {
      return;
    }

    updateMutation.mutate(values, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  /**
   * Prevent closing the dialog while saving.
   */
  const handleOpenChange = (nextOpen: boolean) => {
    if (updateMutation.isPending && !nextOpen) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Edit Organization
          </DialogTitle>

          <DialogDescription>
            Update the organization&apos;s business information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* ============================= */}
            {/* BUSINESS INFORMATION */}
            {/* ============================= */}

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">
                  Business Information
                </h3>

                <p className="text-xs text-muted-foreground">
                  Update the organization&apos;s basic business information.
                </p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Organization Name
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter organization name"
                        {...field}
                      />
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
            </div>

            {/* ============================= */}
            {/* BUSINESS CONTACT */}
            {/* ============================= */}

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">
                  Business Contact
                </h3>

                <p className="text-xs text-muted-foreground">
                  These details are used for official organization
                  communication.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                          placeholder="+1 555 123 4567"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ============================= */}
            {/* ACTIONS */}
            {/* ============================= */}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  updateMutation.isPending ||
                  !organizationId
                }
              >
                {updateMutation.isPending
                  ? 'Saving Changes...'
                  : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
