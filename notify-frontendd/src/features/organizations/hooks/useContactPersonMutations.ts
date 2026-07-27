'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { organizationApi } from '../api/organization.api';
import { queryKeys } from '@/lib/query/query-keys';
import { ApiClientError } from '@/lib/api/errors';
import { ContactPerson } from '../types/organization.types';

function onError(error: ApiClientError) {
  toast.error(error.message);
}

export function useAddContactPerson(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<ContactPerson, 'id' | 'organizationId'>) =>
      organizationApi.addContactPerson(organizationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.detail(organizationId) });
      toast.success('Contact person added');
    },
    onError,
  });
}

export function useUpdateContactPerson(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contactId,
      payload,
    }: {
      contactId: string;
      payload: Partial<Omit<ContactPerson, 'id' | 'organizationId'>>;
    }) => organizationApi.updateContactPerson(organizationId, contactId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.detail(organizationId) });
      toast.success('Contact person updated');
    },
    onError,
  });
}

export function useRemoveContactPerson(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) =>
      organizationApi.removeContactPerson(organizationId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.detail(organizationId) });
      toast.success('Contact person removed');
    },
    onError,
  });
}