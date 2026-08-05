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
// NOTE: depends on the permissions sub-feature's list hook — build that module for this to compile.
import { usePermissions } from '../../permissions/hooks/usePermissions';
import { addPermissionSchema, type AddPermissionFormValues } from '../schemas/role.schema';
import { useRolePermissions } from '../hooks/useRolePermissions';
import { useAddPermission } from '../hooks/useAddPermission';
import { useRemovePermission } from '../hooks/useRemovePermission';
import type { Role } from '../types/role.types';

interface RolePermissionDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RolePermissionDialog({
  role,
  open,
  onOpenChange,
}: RolePermissionDialogProps) {
  const { data: assignedPermissions, isLoading: assignedLoading } =
    useRolePermissions(role?.id);
  const { data: allPermissions } = usePermissions({ limit: 200, page: 1 });
  const addPermission = useAddPermission();
  const removePermission = useRemovePermission();

  const form = useForm<AddPermissionFormValues>({
    resolver: zodResolver(addPermissionSchema),
    defaultValues: { permissionId: '' },
  });

  if (!role) return null;

  const assignedPermissionIds = new Set(
    assignedPermissions?.map((p) => p.permissionId)
  );
  const availablePermissions = (allPermissions?.items ?? []).filter(
    (permission) => !assignedPermissionIds.has(permission.id)
  );

  const handleAdd = (values: AddPermissionFormValues) => {
    addPermission.mutate(
      { roleId: role.id, payload: { permissionId: values.permissionId } },
      { onSuccess: () => form.reset() }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage permissions — {role.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Current permissions</p>
            {assignedLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : assignedPermissions && assignedPermissions.length > 0 ? (
              <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto">
                {assignedPermissions.map((rp) => (
                  <Badge
                    key={rp.id}
                    variant="outline"
                    className="flex items-center gap-1 pr-1"
                  >
                    {rp.permission.name}
                    <button
                      type="button"
                      onClick={() =>
                        removePermission.mutate({
                          roleId: role.id,
                          permissionId: rp.permissionId,
                        })
                      }
                      disabled={removePermission.isPending}
                      className="rounded-full p-0.5 hover:bg-muted"
                      aria-label={`Remove ${rp.permission.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No permissions assigned yet.
              </p>
            )}
          </div>

          <form onSubmit={form.handleSubmit(handleAdd)} className="flex items-end gap-2">
            <div className="flex-1">
              <p className="mb-2 text-sm font-medium">Add a permission</p>
              <Select
                onValueChange={(value) => form.setValue('permissionId', value)}
                value={form.watch('permissionId')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a permission" />
                </SelectTrigger>
                <SelectContent>
                  {availablePermissions.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No more permissions to add
                    </div>
                  ) : (
                    availablePermissions.map((permission) => (
                      <SelectItem key={permission.id} value={permission.id}>
                        {permission.module} · {permission.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={addPermission.isPending || !form.watch('permissionId')}
            >
              Add
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