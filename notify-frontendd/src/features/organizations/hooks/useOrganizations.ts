'use client';

import { useQuery } from '@tanstack/react-query';

import { organizationApi } from '../api/organization.api';
import { queryKeys } from '@/lib/query/query-keys';
import { OrganizationListFilters } from '../types/organization.types';

export function useOrganizations(filters: OrganizationListFilters) {
  return useQuery({
    queryKey: queryKeys.organizations.list(filters),
    queryFn: () => organizationApi.list(filters),
    staleTime: 30 * 1000,
  });
}