import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../api/users.api';
import { queryKeys } from '@/lib/query/query-keys';

interface RemoveRoleArgs {
  userId: string;
  roleId: string;
}

export function useRemoveRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: RemoveRoleArgs) =>
      usersApi.removeRole(userId, roleId),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.roles(userId) });
      toast.success('Role removed successfully');
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to remove role';
      toast.error(message);
    },
  });
}