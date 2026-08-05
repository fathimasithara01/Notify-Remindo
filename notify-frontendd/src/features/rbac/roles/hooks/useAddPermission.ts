import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rolesApi } from '../api/roles.api';
import type { AddPermissionDto } from '../types/role.types';
import { queryKeys } from '@/lib/query/query-keys';

interface AddPermissionArgs {
  roleId: string;
  payload: AddPermissionDto;
}

export function useAddPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, payload }: AddPermissionArgs) =>
      rolesApi.addPermission(roleId, payload),
    onSuccess: (_data, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.permissions(roleId) });
      toast.success('Permission added successfully');
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to add permission';
      toast.error(message);
    },
  });
}