import { apiClient } from './client';
import {
  Organization,
  ContactPerson,
  CreateOrganizationPayload,
  EditOrganizationPayload,
  OrganizationListFilter,
} from '../types/organization';
import { PaginatedResponse } from '../types/pagination';

export const organizationApi = {
  list: (filter?: OrganizationListFilter) =>
    apiClient.get<PaginatedResponse<Organization>>('/organizations', {
      status: filter?.status,
      planId: filter?.planId,
      page: filter?.page?.toString(),
      limit: filter?.limit?.toString(),
    }),

  getOne: (id: string) =>
    apiClient.get<Organization & { contactPersons: ContactPerson[] }>(`/organizations/${id}`),

  create: (payload: CreateOrganizationPayload) =>
    apiClient.post<Organization>('/organizations', payload),

  update: (id: string, payload: EditOrganizationPayload) =>
    apiClient.patch<Organization>(`/organizations/${id}`, payload),

  delete: (id: string) => apiClient.delete<null>(`/organizations/${id}`),

  block: (id: string, reason?: string) =>
    apiClient.post<Organization>(`/organizations/${id}/block`, { reason }),

  unblock: (id: string) => apiClient.post<Organization>(`/organizations/${id}/unblock`),

  upgradePlan: (id: string, newPlanId: string) =>
    apiClient.post<Organization>(`/organizations/${id}/upgrade-plan`, { newPlanId }),

  addContactPerson: (id: string, payload: Omit<ContactPerson, 'id' | 'organizationId'>) =>
    apiClient.post<ContactPerson>(`/organizations/${id}/contacts`, payload),
};