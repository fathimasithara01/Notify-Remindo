'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { UserTable } from './components/UserTable';
import { UserFilters } from './components/UserFilters';
import { UserForm } from './components/UserForm';
import { UserRoleDialog } from './components/UserRoleDialog';
import { RevokeSessionDialog } from './components/RevokeSessionDialog';
import { InviteSuccessDialog } from './components/InviteSuccessDialog';

import { useUsers } from './hooks/useUsers';
import { useCreateUser } from './hooks/useCreateUser';
import { useUpdateUser } from './hooks/useUpdateUser';
import { useDeleteUser } from './hooks/useDeleteUser';
import { useResendInvite } from './hooks/useResendInvite';
import { useRequestPasswordReset } from './hooks/useRequestPasswordReset';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { DEFAULT_PAGE_SIZE } from '../shared/constants';
import { ROUTES } from '@/config/routes';

import type { User, UserFilters as UserFiltersType } from './types/user.types';
import type { CreateUserFormValues, EditUserFormValues } from './schemas/user.schema';

type DialogState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; user: User }
  | { type: 'roles'; user: User }
  | { type: 'revoke'; user: User }
  | { type: 'delete'; user: User };

/** Holds the invite result (link + email delivery status) shown right after a
 * successful invite. Kept separate from `dialog` state so it survives the
 * create dialog closing — the success dialog opens right after. */
interface InviteResult {
  userName: string;
  inviteUrl: string;
  emailSent: boolean;
  kind: 'invite' | 'resend' | 'reset';
}

export default function UsersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<UserFiltersType>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [dialog, setDialog] = useState<DialogState>({ type: 'none' });
  const [inviteResult, setInviteResult] = useState<InviteResult | null>(null);

  const { data, isLoading } = useUsers(filters);
  const { data: currentUser } = useCurrentUser();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const resendInvite = useResendInvite();
  const requestPasswordReset = useRequestPasswordReset();

  const closeDialog = () => setDialog({ type: 'none' });

  const handleCreateSubmit = (values: CreateUserFormValues | EditUserFormValues) => {
    createUser.mutate(values as CreateUserFormValues, {
      onSuccess: (data) => {
        closeDialog();
        setInviteResult({
          userName: `${data.firstName} ${data.lastName}`.trim(),
          inviteUrl: data.inviteUrl,
          emailSent: data.emailSent,
          kind: 'invite',
        });
      },
    });
  };

  const handleResendInvite = (user: User) => {
    resendInvite.mutate(user.id, {
      onSuccess: (data) => {
        setInviteResult({
          userName: `${user.firstName} ${user.lastName}`.trim(),
          inviteUrl: data.inviteUrl,
          emailSent: data.emailSent,
          kind: 'resend',
        });
      },
    });
  };

  const handleRequestPasswordReset = (user: User) => {
    requestPasswordReset.mutate(user.id, {
      onSuccess: (data) => {
        setInviteResult({
          userName: `${user.firstName} ${user.lastName}`.trim(),
          inviteUrl: data.resetUrl,
          emailSent: data.emailSent,
          kind: 'reset',
        });
      },
    });
  };

  const handleEditSubmit = (values: CreateUserFormValues | EditUserFormValues) => {
    if (dialog.type !== 'edit') return;
    updateUser.mutate(
      { id: dialog.user.id, payload: values as EditUserFormValues },
      { onSuccess: closeDialog }
    );
  };

  const handleDeleteConfirm = () => {
    if (dialog.type !== 'delete') return;
    deleteUser.mutate(dialog.user.id, { onSuccess: closeDialog });
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.meta.total / data.meta.limit)) : 1;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Invite, edit, and manage access for your organization&apos;s users.
          </p>
        </div>
        <Button onClick={() => setDialog({ type: 'create' })}>
          <Plus className="mr-2 h-4 w-4" />
          Invite user
        </Button>
      </div>

      <UserFilters filters={filters} onChange={setFilters} />

      <UserTable
        users={data?.items ?? []}
        isLoading={isLoading}
        currentUserId={currentUser?.id}
        onView={(user) => router.push(ROUTES.users.detail(user.id))}
        onEdit={(user) => setDialog({ type: 'edit', user })}
        onDelete={(user) => setDialog({ type: 'delete', user })}
        onManageRoles={(user) => setDialog({ type: 'roles', user })}
        onRevokeSessions={(user) => setDialog({ type: 'revoke', user })}
        onResendInvite={handleResendInvite}
        onRequestPasswordReset={handleRequestPasswordReset}
      />

      {data && data.meta.total > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setFilters((f) => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))
                }
                className={filters.page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-sm text-muted-foreground">
                Page {filters.page ?? 1} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    page: Math.min(totalPages, (f.page ?? 1) + 1),
                  }))
                }
                className={
                  (filters.page ?? 1) >= totalPages ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create user */}
      <Dialog open={dialog.type === 'create'} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite user</DialogTitle>
          </DialogHeader>
          <UserForm
            mode="create"
            onSubmit={handleCreateSubmit}
            isSubmitting={createUser.isPending}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Edit user */}
      <Dialog open={dialog.type === 'edit'} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          {dialog.type === 'edit' && (
            <UserForm
              mode="edit"
              user={dialog.user}
              onSubmit={handleEditSubmit}
              isSubmitting={updateUser.isPending}
              onCancel={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Manage roles */}
      <UserRoleDialog
        user={dialog.type === 'roles' ? dialog.user : null}
        open={dialog.type === 'roles'}
        onOpenChange={(o) => !o && closeDialog()}
      />

      {/* Revoke sessions */}
      <RevokeSessionDialog
        user={dialog.type === 'revoke' ? dialog.user : null}
        open={dialog.type === 'revoke'}
        onOpenChange={(o) => !o && closeDialog()}
      />

      {/* Invite success — shows the invite link, with a warning + copy
          fallback if the email failed to send */}
      {inviteResult && (
        <InviteSuccessDialog
          open={!!inviteResult}
          onOpenChange={(o) => !o && setInviteResult(null)}
          userName={inviteResult.userName}
          value={inviteResult.inviteUrl}
          emailSent={inviteResult.emailSent}
          kind={inviteResult.kind}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog open={dialog.type === 'delete'} onOpenChange={(o) => !o && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              {dialog.type === 'delete' && (
                <>
                  This will permanently remove <strong>{dialog.user.firstName} {dialog.user.lastName}</strong>{' '}
                  and revoke their access. This action cannot be undone.
                </>
              )}
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