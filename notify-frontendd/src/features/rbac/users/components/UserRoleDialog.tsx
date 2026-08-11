'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoles } from '../../roles/hooks/useRoles';
import { changeRoleSchema, type ChangeRoleFormValues } from '../schemas/user.schema';
import { useUpdateUser } from '../hooks/useUpdateUser';
import type { User } from '../types/user.types';

interface UserRoleDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserRoleDialog({ user, open, onOpenChange }: UserRoleDialogProps) {
  const { data: allRoles, isLoading: rolesLoading } = useRoles({
    status: 'active',
    limit: 100,
    page: 1,
  });

const updateUser = useUpdateUser();

  const form = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    values: { roleId: user?.roleId ?? '' },
  });

  if (!user) return null;

  const availableRoles = allRoles?.items ?? [];
  const handleSubmit = (values: ChangeRoleFormValues) => {
    updateUser.mutate(
      { id: user.id, payload: { roleId: values.roleId } },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage role —{user.firstName} {user.lastName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Role</p>
            {rolesLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                onValueChange={(value) => form.setValue('roleId', value)}
                value={form.watch('roleId')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No active roles available
                    </div>
                  ) : (
                    availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                updateUser.isPending ||
                !form.watch('roleId') ||
                form.watch('roleId') === user.roleId
              }
            >
              {updateUser.isPending ? 'Saving...' : 'Save role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}