import { apiClient } from './client';
import { Organization, ContactPerson, CreateOrganizationPayload, OrganizationListFilter, } from '../types/organizations';

export const organizationApi = {
    list: (filter?: OrganizationListFilter) =>
        apiClient.get<Organization[]>('/organizations', {
            status: filter?.status,
            planId: filter?.planId,
        }),

    getOne: (id: string) =>
        apiClient.get<Organization & { contactPersons: ContactPerson[] }>(`/organizations/${id}`),

    create: (payload: CreateOrganizationPayload) =>
        apiClient.post<Organization>('/organizations', payload),

    block: (id: string, reason?: string) =>
        apiClient.post<Organization>(`/organizations/${id}/block`, { reason }),

    unblock: (id: string) => apiClient.post<Organization>(`/organizations/${id}/unblock`),

    upgradePlan: (id: string, newPlanId: string) =>
        apiClient.post<Organization>(`/organizations/${id}/upgrade-plan`, { newPlanId }),

    addContactPerson: (id: string, payload: Omit<ContactPerson, 'id' | 'organizationId'>) =>
        apiClient.post<ContactPerson>(`/organizations/${id}/contacts`, payload),
};