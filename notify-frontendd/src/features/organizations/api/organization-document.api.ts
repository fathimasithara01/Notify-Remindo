import { apiClient } from '@/lib/api/client';
import { OrganizationDocument } from '../types/organization.types';

export const organizationDocumentApi = {
  /**
   * Upload a document for an organization
   */
  upload: (
    organizationId: string,
    file: File,
  ) => {
    const formData = new FormData();

    formData.append('document', file);

    return apiClient.post<OrganizationDocument>(
      `/organizations/${organizationId}/documents`,
      formData,
    );
  },

  /**
   * Get all documents of an organization
   */
  list: (
    organizationId: string,
  ) =>
    apiClient.get<OrganizationDocument[]>(
      `/organizations/${organizationId}/documents`,
    ),

  /**
   * Get secure download URL
   */
  getDownloadUrl: (
    organizationId: string,
    documentId: string,
  ) =>
    apiClient.get<{ downloadUrl: string }>(
      `/organizations/${organizationId}/documents/${documentId}/download`,
    ),

  /**
   * Delete an organization document
   */
  delete: (
    organizationId: string,
    documentId: string,
  ) =>
    apiClient.delete<null>(
      `/organizations/${organizationId}/documents/${documentId}`,
    ),
};