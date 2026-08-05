import { apiClient } from '@/lib/api/client';
import { PaginatedResponse } from '@/types/pagination';
import {
    Organization,
    CreateOrganizationPayload,
    EditOrganizationPayload,
    OrganizationListFilters,
    ContactPerson,
    NewContactPersonPayload,
} from '../types/organization.types';

export const organizationApi = {

    list: (filters?: OrganizationListFilters) =>
        apiClient.get<PaginatedResponse<Organization>>('/organizations', {
            status: filters?.status,
            salesmanId: filters?.salesmanId,
            planId: filters?.currentPlanId,
            search: filters?.search,
            page: filters?.page?.toString(),
            limit: filters?.limit?.toString(),
        }),

    getOne: (id: string) =>
        apiClient.get<Organization & { contactPersons: ContactPerson[] }>(`/organizations/${id}`),

    create: (payload: CreateOrganizationPayload) =>
        apiClient.post<Organization>('/organizations', payload),

    update: (id: string, payload: EditOrganizationPayload) =>
        apiClient.patch<Organization>(`/organizations/${id}`, payload),

    delete: (id: string) =>
        apiClient.delete<null>(`/organizations/${id}`),

    block: (id: string, reason?: string) =>
        apiClient.post<Organization>(`/organizations/${id}/block`, { reason }),

    unblock: (id: string) =>
        apiClient.post<Organization>(`/organizations/${id}/unblock`),

    upgradePlan: (id: string, newPlanId: string) =>
        apiClient.post<Organization>(`/organizations/${id}/upgrade-plan`, { newPlanId }),

    listContactPersons: (id: string) =>
        apiClient.get<ContactPerson[]>(`/organizations/${id}/contacts`),

    addContactPerson: (id: string, payload: NewContactPersonPayload) =>
        apiClient.post<ContactPerson>(`/organizations/${id}/contacts`, payload),

    updateContactPerson: (id: string, contactId: string, payload: Partial<NewContactPersonPayload>) =>
        apiClient.patch<ContactPerson>(
            `/organizations/${id}/contacts/${contactId}`,
            payload
        ),

    removeContactPerson: (id: string, contactId: string) =>
        apiClient.delete<null>(`/organizations/${id}/contacts/${contactId}`),
};