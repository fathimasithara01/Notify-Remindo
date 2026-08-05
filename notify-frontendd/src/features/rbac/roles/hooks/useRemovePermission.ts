import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rolesApi } from '../api/roles.api';
import { queryKeys } from '@/lib/query/query-keys';

interface RemovePermissionArgs {
  roleId: string;
  permissionId: string;
}

export function useRemovePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionId }: RemovePermissionArgs) =>
      rolesApi.removePermission(roleId, permissionId),
    onSuccess: (_data, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.permissions(roleId) });
      toast.success('Permission removed successfully');
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to remove permission';
      toast.error(message);
    },
  });
}