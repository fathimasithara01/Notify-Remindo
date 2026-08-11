'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useRoles } from '../../roles/hooks/useRoles';
import {
  createUserSchema,
  editUserSchema,
  type CreateUserFormValues,
  type EditUserFormValues,
} from '../schemas/user.schema';
import type { User } from '../types/user.types';

interface UserFormProps {
  mode: 'create' | 'edit';
  user?: User;
  onSubmit: (values: CreateUserFormValues | EditUserFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function UserForm({ mode, user, onSubmit, isSubmitting, onCancel }: UserFormProps) {
  const isEdit = mode === 'edit';

  // Roles are only offered at invite time — editing roles afterward
  // happens through UserRoleDialog, so this fetch is skipped in edit mode.
  const { data: rolesResult, isLoading: rolesLoading } = useRoles(
    { status: 'active', limit: 100, page: 1 },
    { enabled: !isEdit }
  );
  const availableRoles = rolesResult?.items ?? [];

  const form = useForm<CreateUserFormValues | EditUserFormValues>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: isEdit
      ? {
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          phone: user?.phone ?? '',
          status: user?.status === 'inactive' ? 'inactive' : 'active',
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          roleId: '',
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Fathima" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Rahman" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email is only collected at invite time. It becomes the user's
            login identity, so changing it later goes through a separate
            verification flow, not this form. */}
        {!isEdit && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="name@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (optional)</FormLabel>
              <FormControl>
                <Input placeholder="+91XXXXXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEdit && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
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
        )}

        {!isEdit && (
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                {rolesLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-full" />
                  </div>
                ) : availableRoles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No active roles available. Create a role first before inviting a user.
                  </p>
                ) : (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : isEdit
                ? 'Save changes'
                : 'Send invite'}
          </Button>
        </div>
      </form>
    </Form>
  );
}