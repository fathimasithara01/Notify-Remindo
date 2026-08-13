import { apiClient } from '@/lib/api/client';
import { PaginatedResult } from '@/types/pagination';
import {
    Organization,
    CreateOrganizationPayload,
    EditOrganizationPayload,
    OrganizationListFilters,
    ResetAdminPasswordPayload,
    CreateOrganizationResult,
    OrganizationAdmin,
    EditOrganizationAdminPayload
} from '../types/organization.types';

export const organizationApi = {

    list: (filters?: OrganizationListFilters) =>
        apiClient.get<PaginatedResult<Organization>>('/organizations', {
            status: filters?.status,
            salesmanId: filters?.salesmanId,
            planId: filters?.currentPlanId,
            search: filters?.search,
            page: filters?.page?.toString(),
            limit: filters?.limit?.toString(),
        }),

    getOne: (id: string) =>
        apiClient.get<Organization & { contactPersons: OrganizationAdmin[] }>(`/organizations/${id}`),

    create: (payload: CreateOrganizationPayload) =>
        apiClient.post<CreateOrganizationResult>('/organizations', payload),

    update: (id: string, payload: EditOrganizationPayload) =>
        apiClient.patch<Organization>(`/organizations/${id}`, payload),

    // delete: (id: string) =>
    //     apiClient.delete<null>(`/organizations/${id}`),

    updateAdmin: (organizationId: string, payload: EditOrganizationAdminPayload) =>
        apiClient.patch<Organization>(`/organizations/${organizationId}/admin`, payload),

    block: (id: string, reason?: string) =>
        apiClient.post<Organization>(`/organizations/${id}/block`, { reason }),

    unblock: (id: string) =>
        apiClient.post<Organization>(`/organizations/${id}/unblock`),

    resetAdminPassword: (id: string, payload: ResetAdminPasswordPayload) =>
        apiClient.post<null>(`/organizations/${id}/reset-admin-password`, payload),

    resendInvite: (id: string) => apiClient.post<null>(`/organizations/${id}/resend-invite`),

    cancelInvite: (id: string) => apiClient.post<null>(`/organizations/${id}/cancel-invite`),

    upgradePlan: (id: string, newPlanId: string) =>
        apiClient.post<Organization>(`/organizations/${id}/upgrade-plan`, { newPlanId }),
};