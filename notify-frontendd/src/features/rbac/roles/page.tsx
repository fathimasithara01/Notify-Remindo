'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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

import { RoleTable } from './components/RoleTable';
import { RoleFilters } from './components/RoleFilters';
import { RoleForm } from './components/RoleForm';
import { RoleDetails } from './components/RoleDetails';
import { RolePermissionDialog } from './components/RolePermissionDialog';

import { useRoles } from './hooks/useRoles';
import { useCreateRole } from './hooks/useCreateRole';
import { useUpdateRole } from './hooks/useUpdateRole';
import { useDeleteRole } from './hooks/useDeleteRole';
import { DEFAULT_PAGE_SIZE } from '../shared/constants';

import type { Role, RoleFilters as RoleFiltersType } from './types/role.types';
import type { CreateRoleFormValues, EditRoleFormValues } from './schemas/role.schema';

type DialogState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; role: Role }
  | { type: 'view'; role: Role }
  | { type: 'permissions'; role: Role }
  | { type: 'delete'; role: Role };

export default function RolesPage() {
  const [filters, setFilters] = useState<RoleFiltersType>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [dialog, setDialog] = useState<DialogState>({ type: 'none' });

  const { data, isLoading } = useRoles(filters);
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const closeDialog = () => setDialog({ type: 'none' });

  const handleCreateSubmit = (values: CreateRoleFormValues | EditRoleFormValues) => {
    createRole.mutate(values as CreateRoleFormValues, { onSuccess: closeDialog });
  };

  const handleEditSubmit = (values: CreateRoleFormValues | EditRoleFormValues) => {
    if (dialog.type !== 'edit') return;
    updateRole.mutate(
      { id: dialog.role.id, payload: values as EditRoleFormValues },
      { onSuccess: closeDialog }
    );
  };

  const handleDeleteConfirm = () => {
    if (dialog.type !== 'delete') return;
    deleteRole.mutate(dialog.role.id, { onSuccess: closeDialog });
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Roles</h1>
          <p className="text-sm text-muted-foreground">
            Define roles and control what each one can access.
          </p>
        </div>
        <Button onClick={() => setDialog({ type: 'create' })}>
          <Plus className="mr-2 h-4 w-4" />
          Create role
        </Button>
      </div>

      <RoleFilters filters={filters} onChange={setFilters} />

      <RoleTable
        roles={data?.items ?? []}
        isLoading={isLoading}
        onView={(role) => setDialog({ type: 'view', role })}
        onEdit={(role) => setDialog({ type: 'edit', role })}
        onDelete={(role) => setDialog({ type: 'delete', role })}
        onManagePermissions={(role) => setDialog({ type: 'permissions', role })}
      />

      {data && data.total > 0 && (
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

      {/* Create role */}
      <Dialog open={dialog.type === 'create'} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create role</DialogTitle>
          </DialogHeader>
          <RoleForm
            mode="create"
            onSubmit={handleCreateSubmit}
            isSubmitting={createRole.isPending}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Edit role */}
      <Dialog open={dialog.type === 'edit'} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit role</DialogTitle>
          </DialogHeader>
          {dialog.type === 'edit' && (
            <RoleForm
              mode="edit"
              role={dialog.role}
              onSubmit={handleEditSubmit}
              isSubmitting={updateRole.isPending}
              onCancel={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View role details */}
      <Sheet open={dialog.type === 'view'} onOpenChange={(o) => !o && closeDialog()}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Role details</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {dialog.type === 'view' && <RoleDetails role={dialog.role} />}
          </div>
        </SheetContent>
      </Sheet>

      {/* Manage permissions */}
      <RolePermissionDialog
        role={dialog.type === 'permissions' ? dialog.role : null}
        open={dialog.type === 'permissions'}
        onOpenChange={(o) => !o && closeDialog()}
      />

      {/* Delete confirmation */}
      <AlertDialog open={dialog.type === 'delete'} onOpenChange={(o) => !o && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role?</AlertDialogTitle>
            <AlertDialogDescription>
              {dialog.type === 'delete' && (
                <>
                  This will permanently remove the <strong>{dialog.role.name}</strong>{' '}
                  role. Users currently assigned this role will lose the
                  permissions it grants. This action cannot be undone.
                </>
              )}
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