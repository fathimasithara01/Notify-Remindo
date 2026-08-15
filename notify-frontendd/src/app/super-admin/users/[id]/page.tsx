'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Pencil, ShieldCheck, LogOut, Trash2 } from 'lucide-react';
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

import { useUser } from '@/features/rbac/users/hooks/useUser';
import { useUpdateUser } from '@/features/rbac/users/hooks/useUpdateUser';
import { useDeleteUser } from '@/features/rbac/users/hooks/useDeleteUser';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { UserDetails } from '@/features/rbac/users/components/UserDetails';
import { UserForm } from '@/features/rbac/users/components/UserForm';
import { UserRoleDialog } from '@/features/rbac/users/components/UserRoleDialog';
// import { RevokeSessionDialog } from '@/features/rbac/users/components/RevokeSessionDialog';
import type {
  CreateUserFormValues,
  EditUserFormValues,
} from '@/features/rbac/users/schemas/user.schema';
import { useState } from 'react';

type ActiveDialog = 'none' | 'edit' | 'roles' | 'revoke' | 'delete';

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: user, isLoading } = useUser(params.id);
  const { data: currentUser } = useCurrentUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>('none');

  const handleEditSubmit = (values: CreateUserFormValues | EditUserFormValues) => {
    if (!user) return;
    updateUser.mutate(
      { id: user.id, payload: values as EditUserFormValues },
      { onSuccess: () => setActiveDialog('none') }
    );
  };

  const handleDeleteConfirm = () => {
    if (!user) return;
    deleteUser.mutate(user.id, {
      onSuccess: () => router.push(ROUTES.users.list),
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

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">User not found.</p>
        <Link href={ROUTES.users.list} className="mt-2 inline-block text-sm underline">
          Back to users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.users.list}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setActiveDialog('edit')}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveDialog('roles')}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Manage roles
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveDialog('revoke')}>
            <LogOut className="mr-2 h-4 w-4" />
            Revoke sessions
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setActiveDialog('delete')}
            disabled={user.id === currentUser?.id}
            title={user.id === currentUser?.id ? "You can't delete your own account" : undefined}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="max-w-xl rounded-lg border p-6">
        <UserDetails user={user} />
      </div>

      <Dialog open={activeDialog === 'edit'} onOpenChange={(o) => !o && setActiveDialog('none')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          <UserForm
            mode="edit"
            user={user}
            onSubmit={handleEditSubmit}
            isSubmitting={updateUser.isPending}
            onCancel={() => setActiveDialog('none')}
          />
        </DialogContent>
      </Dialog>

      <UserRoleDialog
        user={activeDialog === 'roles' ? user : null}
        open={activeDialog === 'roles'}
        onOpenChange={(o) => !o && setActiveDialog('none')}
      />

      {/* <RevokeSessionDialog
        user={activeDialog === 'revoke' ? user : null}
        open={activeDialog === 'revoke'}
        onOpenChange={(o) => !o && setActiveDialog('none')}
      /> */}

      <AlertDialog open={activeDialog === 'delete'} onOpenChange={(o) => !o && setActiveDialog('none')}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{user.firstName} {user.lastName}</strong> and
              revoke their access. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUser.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteUser.isPending}>
              {deleteUser.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}