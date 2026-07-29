'use client';

import { useQuery } from '@tanstack/react-query';

import { organizationApi } from '../api/organization.api';
import { OrganizationListFilters, } from '../types/organization.types';

import { queryKeys } from '@/lib/query/query-keys';

export function useOrganizations(filters: OrganizationListFilters = {}) {
  return useQuery({
    queryKey: queryKeys.organizations.list(filters),
    queryFn: () => organizationApi.list(filters),
    enabled: true,
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
}