'use client';

import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../api/organization.api';
import { OrganizationListFilter } from '../types/organization.types';
import { queryKeys } from '@/lib/query/query-keys';

export function useOrganizations(filter: OrganizationListFilter) {
  return useQuery({
    queryKey: [...queryKeys.organizations.list(filter.page ?? 1), filter.search, filter.status],
    queryFn: () => organizationApi.list(filter),
  });
}