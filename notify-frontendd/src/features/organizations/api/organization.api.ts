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
    /**
     * Get organizations with filters and pagination
     *
     * Backend:
     * GET /organizations
     *
     * Supports:
     * - status
     * - salesmanId
     * - planId
     * - search
     * - page
     * - limit
     */
    list: (filters?: OrganizationListFilters) => apiClient.get<PaginatedResponse<Organization>>('/organizations',
        {
            status: filters?.status,
            salesmanId: filters?.salesmanId,
            planId: filters?.planId,
            search: filters?.search,
            page: filters?.page?.toString(),
            limit: filters?.limit?.toString(),
        }
    ),

    /**
     * Get single organization
     *
     * Returns:
     * - organization details
     * - organization admin
     * - contact persons
     */
    getOne: (id: string) => apiClient.get<Organization & { contactPersons: ContactPerson[] }>(`/organizations/${id}`),

    /**
     * Create organization
     *
     * Creates:
     * - Organization
     * - Initial Organization Admin User
     * - Organization Admin Role assignment
     * - Subscription (if plan selected)
     * - Invitation email
     */
    create: (payload: CreateOrganizationPayload) =>
        apiClient.post<Organization>(
            '/organizations',
            payload
        ),

    /**
     * Update organization details
     */
    update: (
        id: string,
        payload: EditOrganizationPayload
    ) =>
        apiClient.patch<Organization>(
            `/organizations/${id}`,
            payload
        ),

    /**
     * Soft delete organization
     */
    delete: (id: string) =>
        apiClient.delete<null>(
            `/organizations/${id}`
        ),

    /**
     * Block organization
     */
    block: (
        id: string,
        reason?: string
    ) =>
        apiClient.post<Organization>(
            `/organizations/${id}/block`,
            { reason }
        ),

    /**
     * Unblock organization
     */
    unblock: (id: string) =>
        apiClient.post<Organization>(
            `/organizations/${id}/unblock`
        ),

    /**
     * Upgrade organization subscription plan
     */
    upgradePlan: (
        id: string,
        newPlanId: string
    ) =>
        apiClient.post<Organization>(
            `/organizations/${id}/upgrade-plan`,
            { newPlanId }
        ),

    listContactPersons: (id: string) =>
        apiClient.get<ContactPerson[]>(
            `/organizations/${id}/contacts`
        ),

    addContactPerson: (
        id: string,
        payload: NewContactPersonPayload
    ) =>
        apiClient.post<ContactPerson>(
            `/organizations/${id}/contacts`,
            payload
        ),

    updateContactPerson: (
        id: string,
        contactId: string,
        payload: Partial<NewContactPersonPayload>
    ) =>
        apiClient.patch<ContactPerson>(
            `/organizations/${id}/contacts/${contactId}`,
            payload
        ),

    removeContactPerson: (
        id: string,
        contactId: string
    ) =>
        apiClient.delete<null>(
            `/organizations/${id}/contacts/${contactId}`
        ),
};