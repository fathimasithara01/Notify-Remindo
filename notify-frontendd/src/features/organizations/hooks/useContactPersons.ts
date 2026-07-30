'use client';

import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../api/organization.api';
import { queryKeys } from '@/lib/query/query-keys';

export function useContactPersons(organizationId: string) {
  return useQuery({
    queryKey: queryKeys.organizations.contacts(organizationId),
    queryFn: () => organizationApi.listContactPersons(organizationId),
    enabled: Boolean(organizationId),
  });
}