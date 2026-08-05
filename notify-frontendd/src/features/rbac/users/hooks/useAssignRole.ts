import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../api/users.api';
import type { AssignRoleDto } from '../types/user.types';
import { queryKeys } from '@/lib/query/query-keys';

interface AssignRoleArgs {
  userId: string;
  payload: AssignRoleDto;
}

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: AssignRoleArgs) =>
      usersApi.assignRole(userId, payload),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.roles(userId) });
      toast.success('Role assigned successfully');
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to assign role';
      toast.error(message);
    },
  });
}