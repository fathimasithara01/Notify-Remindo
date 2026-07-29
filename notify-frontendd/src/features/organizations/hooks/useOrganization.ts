'use client';

import { useQuery } from '@tanstack/react-query';

import { organizationApi } from '../api/organization.api';
import { queryKeys } from '@/lib/query/query-keys';

export function useOrganization(
  id?: string
) {
  return useQuery({
    queryKey:
      queryKeys.organizations.detail(
        id ?? ''
      ),

    queryFn: () =>
      organizationApi.getOne(id!),

    enabled: Boolean(id),

    staleTime: 30 * 1000,
  });
}