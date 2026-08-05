import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rolesApi } from '../api/roles.api';
import type { UpdateRoleDto } from '../types/role.types';
import { queryKeys } from '@/lib/query/query-keys';

interface UpdateRoleArgs {
  id: string;
  payload: UpdateRoleDto;
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateRoleArgs) => rolesApi.update(id, payload),
    onSuccess: (updatedRole) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.setQueryData(
        queryKeys.roles.detail(updatedRole.id),
        updatedRole
      );
      toast.success('Role updated successfully');
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to update role';
      toast.error(message);
    },
  });
}