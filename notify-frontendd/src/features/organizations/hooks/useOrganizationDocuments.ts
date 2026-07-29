'use client';

import { useQuery } from '@tanstack/react-query';

import { organizationDocumentApi } from '../api/organization-document.api';

import { queryKeys } from '@/lib/query/query-keys';

export function useOrganizationDocuments(organizationId: string) {
  return useQuery({
    queryKey: queryKeys.organizations.documents(organizationId),

    queryFn: () =>
      organizationDocumentApi.list(
        organizationId,
      ),

    enabled: !!organizationId,
  });
}