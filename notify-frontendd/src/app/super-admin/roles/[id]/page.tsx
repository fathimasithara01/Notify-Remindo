'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Pencil, KeyRound, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/config/routes';

import { useRole } from '@/features/rbac/roles/hooks/useRole';
import { useUpdateRole } from '@/features/rbac/roles/hooks/useUpdateRole';
import { useDeleteRole } from '@/features/rbac/roles/hooks/useDeleteRole';
import { RoleDetails } from '@/features/rbac/roles/components/RoleDetails';
import { RoleForm } from '@/features/rbac/roles/components/RoleForm';
import { RolePermissionDialog } from '@/features/rbac/roles/components/RolePermissionDialog';
import type {
  CreateRoleFormValues,
  EditRoleFormValues,
} from '@/features/rbac/roles/schemas/role.schema';
import { useState } from 'react';

type ActiveDialog = 'none' | 'edit' | 'permissions' | 'delete';

export default function RoleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: role, isLoading } = useRole(params.id);
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>('none');

  const handleEditSubmit = (values: CreateRoleFormValues | EditRoleFormValues) => {
    if (!role) return;
    updateRole.mutate(
      { id: role.id, payload: values as EditRoleFormValues },
      { onSuccess: () => setActiveDialog('none') }
    );
  };

  const handleDeleteConfirm = () => {
    if (!role) return;
    deleteRole.mutate(role.id, {
      onSuccess: () => router.push(ROUTES.roles.list),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full max-w-md" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Role not found.</p>
        <Link href={ROUTES.roles.list} className="mt-2 inline-block text-sm underline">
          Back to roles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.roles.list}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to roles
        </Link>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveDialog('edit')}
            disabled={role.isSystem}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveDialog('permissions')}>
            <KeyRound className="mr-2 h-4 w-4" />
            Manage permissions
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setActiveDialog('delete')}
            disabled={role.isSystem}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="max-w-xl rounded-lg border p-6">
        <RoleDetails role={role} />
      </div>

      <Dialog open={activeDialog === 'edit'} onOpenChange={(o) => !o && setActiveDialog('none')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit role</DialogTitle>
          </DialogHeader>
          <RoleForm
            mode="edit"
            role={role}
            onSubmit={handleEditSubmit}
            isSubmitting={updateRole.isPending}
            onCancel={() => setActiveDialog('none')}
          />
        </DialogContent>
      </Dialog>

      <RolePermissionDialog
        role={activeDialog === 'permissions' ? role : null}
        open={activeDialog === 'permissions'}
        onOpenChange={(o) => !o && setActiveDialog('none')}
      />

      <AlertDialog open={activeDialog === 'delete'} onOpenChange={(o) => !o && setActiveDialog('none')}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the <strong>{role.name}</strong>{' '}
              role. Users currently assigned this role will lose the
              permissions it grants. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteRole.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteRole.isPending}>
              {deleteRole.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}