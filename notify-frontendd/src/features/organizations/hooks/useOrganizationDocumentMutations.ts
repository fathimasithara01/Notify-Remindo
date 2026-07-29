'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { organizationDocumentApi } from '../api/organization-document.api';

import { queryKeys } from '@/lib/query/query-keys';
import { ApiClientError } from '@/lib/api/errors';

function onError(error: ApiClientError) {
  toast.error(error.message);
}

export function useUploadOrganizationDocument(
  organizationId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      organizationDocumentApi.upload(
        organizationId,
        file,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.documents(
          organizationId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.detail(
          organizationId,
        ),
      });

      toast.success('Document uploaded successfully.');
    },

    onError,
  });
}

export function useDeleteOrganizationDocument(
  organizationId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      organizationDocumentApi.delete(
        organizationId,
        documentId,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.documents(
          organizationId,
        ),
      });

      toast.success('Document deleted successfully.');
    },

    onError,
  });
}

export function useDownloadOrganizationDocument(
  organizationId: string,
) {
  return useMutation({
    mutationFn: async (documentId: string) => {
      const response =
        await organizationDocumentApi.getDownloadUrl(
          organizationId,
          documentId,
        );

      window.open(
        response.downloadUrl,
        '_blank',
        'noopener,noreferrer',
      );
    },

    onError,
  });
}