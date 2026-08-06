import { useMutation } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';

export function useResendInvite() {
  return useMutation({
    mutationFn: (userId: string) => usersApi.resendInvite(userId),
  });
}