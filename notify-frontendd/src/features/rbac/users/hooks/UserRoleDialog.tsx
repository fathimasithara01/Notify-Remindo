'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
// NOTE: depends on the roles sub-feature's list hook — build that module for this to compile.
import { useRoles } from '../../roles/hooks/useRoles';
import { assignRoleSchema, type AssignRoleFormValues } from '../schemas/user.schema';
import { useUserRoles } from '../hooks/useUserRoles';
import { useAssignRole } from '../hooks/useAssignRole';
import { useRemoveRole } from '../hooks/useRemoveRole';
import type { User } from '../types/user.types';

interface UserRoleDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserRoleDialog({ user, open, onOpenChange }: UserRoleDialogProps) {
  const { data: assignedRoles, isLoading: assignedLoading } = useUserRoles(user?.id);
  const { data: allRoles } = useRoles({ status: 'active', limit: 100, page: 1 });
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();

  const form = useForm<AssignRoleFormValues>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: { roleId: '' },
  });

  if (!user) return null;

  const assignedRoleIds = new Set(assignedRoles?.map((r) => r.roleId));
  const availableRoles = (allRoles?.items ?? []).filter(
    (role) => !assignedRoleIds.has(role.id)
  );

  const handleAssign = (values: AssignRoleFormValues) => {
    assignRole.mutate(
      { userId: user.id, payload: { roleId: values.roleId } },
      { onSuccess: () => form.reset() }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage roles — {user.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Current roles</p>
            {assignedLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : assignedRoles && assignedRoles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {assignedRoles.map((userRole) => (
                  <Badge
                    key={userRole.id}
                    variant="outline"
                    className="flex items-center gap-1 pr-1"
                  >
                    {userRole.role.name}
                    <button
                      type="button"
                      onClick={() =>
                        removeRole.mutate({ userId: user.id, roleId: userRole.roleId })
                      }
                      disabled={removeRole.isPending}
                      className="rounded-full p-0.5 hover:bg-muted"
                      aria-label={`Remove ${userRole.role.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No roles assigned yet.</p>
            )}
          </div>

          <form
            onSubmit={form.handleSubmit(handleAssign)}
            className="flex items-end gap-2"
          >
            <div className="flex-1">
              <p className="mb-2 text-sm font-medium">Assign a role</p>
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
                      No more roles to assign
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
            </div>
            <Button type="submit" disabled={assignRole.isPending || !form.watch('roleId')}>
              Assign
            </Button>
          </form>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}