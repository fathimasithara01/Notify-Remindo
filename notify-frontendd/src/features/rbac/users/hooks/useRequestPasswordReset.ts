import { useMutation } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (userId: string) => usersApi.requestPasswordReset(userId),
  });
}