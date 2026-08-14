'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
import { useRequestPasswordReset } from './hooks/useRequestPasswordReset';
import { useBlockUser } from './hooks/useBlockUser';
import { useUnblockUser } from './hooks/useUnblockUser';

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { ROUTES } from '@/config/routes';

import { ResetPlatfromUserPasswordSchema, type ResetPlatfromUserPassword } from './schemas/user.schema';
import type { User, UserFilters as UserFiltersType } from './types/user.types';
import type { CreateUserFormValues, EditUserFormValues } from './schemas/user.schema';

type DialogState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; user: User }
  | { type: 'roles'; user: User }
  | { type: 'revoke'; user: User }
  | { type: 'resetPassword'; user: User }
  | { type: 'delete'; user: User };

interface InviteResult {
  userName: string;
}

const PASSWORD_RULES: { label: string; test: (v: string) => boolean }[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /[0-9]/.test(v) },
];

function PasswordRulesList({ password }: { password: string }) {
  return (
    <ul className="space-y-1">
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <li
            key={rule.label}
            className={`flex items-center gap-1.5 text-xs ${
              passed ? 'text-green-600' : 'text-muted-foreground'
            }`}
          >
            {passed ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<UserFiltersType>({});
  const [dialog, setDialog] = useState<DialogState>({ type: 'none' });
  const [inviteResult, setInviteResult] = useState<InviteResult | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordForm = useForm<ResetPlatfromUserPassword>({
    resolver: zodResolver(ResetPlatfromUserPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const { data, isLoading } = useUsers(filters);
  const { data: currentUser } = useCurrentUser();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const requestPasswordReset = useRequestPasswordReset();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();

  const handleBlock = (user: User) => {
    blockUser.mutate(user.id);
  };

  const handleUnblock = (user: User) => {
    unblockUser.mutate(user.id);
  };

  const closeDialog = () => {
    setDialog({ type: 'none' });
    resetPasswordForm.reset();
  };

  const handleCreateSubmit = (values: CreateUserFormValues | EditUserFormValues) => {
    createUser.mutate(values as CreateUserFormValues, {
      onSuccess: closeDialog,
    });
  };

  const handleEditSubmit = (values: CreateUserFormValues | EditUserFormValues) => {
    if (dialog.type !== 'edit') return;
    updateUser.mutate(
      { id: dialog.user.id, payload: values as EditUserFormValues },
      { onSuccess: closeDialog }
    );
  };

  const handleResetPasswordSubmit = (values: ResetPlatfromUserPassword) => {
    if (dialog.type !== 'resetPassword') return;
    const user = dialog.user;

    requestPasswordReset.mutate(
      { userId: user.id, payload: values },
      {
        onSuccess: () => {
          closeDialog();
          setInviteResult({
            userName: `${user.firstName} ${user.lastName}`.trim(),
          });
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (dialog.type !== 'delete') return;
    deleteUser.mutate(dialog.user.id, { onSuccess: closeDialog });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and manage access for your organization&apos;s users.
          </p>
        </div>
        <Button onClick={() => setDialog({ type: 'create' })}>
          <Plus className="mr-2 h-4 w-4" />
          Create user
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
        onRequestPasswordReset={(user) => setDialog({ type: 'resetPassword', user })}
        onBlock={handleBlock}
        onUnblock={handleUnblock}
      />

      {/* Create user */}
      <Dialog open={dialog.type === 'create'} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create user</DialogTitle>
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

      {/* Reset password — admin sets a new password directly */}
      <Dialog open={dialog.type === 'resetPassword'} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
          </DialogHeader>
          {dialog.type === 'resetPassword' && (
            <form
              className="space-y-4"
              onSubmit={resetPasswordForm.handleSubmit(handleResetPasswordSubmit)}
            >
              <p className="text-sm text-muted-foreground">
                Set a new password for{' '}
                <strong>
                  {dialog.user.firstName} {dialog.user.lastName}
                </strong>
                .
              </p>

              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="pr-10"
                    {...resetPasswordForm.register('password')}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {resetPasswordForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {resetPasswordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Password rules checklist */}
              <PasswordRulesList password={resetPasswordForm.watch('password') ?? ''} />

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="pr-10"
                    {...resetPasswordForm.register('confirmPassword')}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {resetPasswordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {resetPasswordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  disabled={requestPasswordReset.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={requestPasswordReset.isPending}>
                  {requestPasswordReset.isPending ? 'Saving...' : 'Save password'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation after password reset */}
      {inviteResult && (
        <InviteSuccessDialog
          open={!!inviteResult}
          onOpenChange={(o) => !o && setInviteResult(null)}
          userName={inviteResult.userName}
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