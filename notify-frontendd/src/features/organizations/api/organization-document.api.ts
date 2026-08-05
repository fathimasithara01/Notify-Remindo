import { OrganizationDocument } from '../types/organization.types';
import axiosInstance from '@/lib/api/axios-instance';

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

    return axiosInstance.post<OrganizationDocument>(
      `/organizations/${organizationId}/documents`,
      formData,
    );
  },

  
  list: (
    organizationId: string,
  ) =>
    axiosInstance.get<OrganizationDocument[]>(
      `/organizations/${organizationId}/documents`,
    ),

  /**
   * Get secure download URL
   */
  getDownloadUrl: (
    organizationId: string,
    documentId: string,
  ) =>
    axiosInstance.get<{ downloadUrl: string }>(
      `/organizations/${organizationId}/documents/${documentId}/download`,
    ),

  /**
   * Delete an organization document
   */
  delete: (
    organizationId: string,
    documentId: string,
  ) =>
    axiosInstance.delete<null>(
      `/organizations/${organizationId}/documents/${documentId}`,
    ),
};