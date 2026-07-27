'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { organizationApi } from '../api/organization.api';
import { queryKeys } from '@/lib/query/query-keys';
import { ROUTES } from '@/config/routes';
import { ApiClientError } from '@/lib/api/errors';
import {
    CreateOrganizationPayload,
    EditOrganizationPayload,
} from '../types/organization.types';

function onError(error: ApiClientError) {
    toast.error(error.message);
}

export function useCreateOrganization() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateOrganizationPayload) => organizationApi.create(payload),
        onSuccess: (org) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all() });
            toast.success('Organization created');
            router.push(ROUTES.organizations.detail(org.id));
        },
        onError,
    });
}

export function useUpdateOrganization(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: EditOrganizationPayload) => organizationApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all() });
            toast.success('Organization updated');
        },
        onError,
    });
}

export function useDeleteOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => organizationApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all() });
            toast.success('Organization deleted');
        },
        onError,
    });
}

export function useBlockOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
            organizationApi.block(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all() });
            toast.success('Organization blocked');
        },
        onError,
    });
}

export function useUnblockOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => organizationApi.unblock(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all() });
            toast.success('Organization unblocked');
        },
        onError,
    });
}

export function useUpgradePlan(organizationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newPlanId: string) => organizationApi.upgradePlan(organizationId, newPlanId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.organizations.detail(organizationId) });
            toast.success('Plan upgraded');
        },
        onError,
    });
}