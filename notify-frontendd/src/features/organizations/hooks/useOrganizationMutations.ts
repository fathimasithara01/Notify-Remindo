'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

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


/**
 * Create Organization
 *
 * Backend creates:
 * - Organization
 * - Initial Organization Admin User
 * - Organization Admin Role
 * - Subscription (if plan selected)
 * - Invitation email
 */
export function useCreateOrganization() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateOrganizationPayload
    ) => organizationApi.create(payload),

    onSuccess: (organization) => {
      // Refresh organization list
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all(),
      });

      toast.success(
        'Organization created successfully'
      );

      // Navigate to newly created organization
      router.push(
        ROUTES.organizations.detail(
          organization.id
        )
      );
    },

    onError,
  });
}


/**
 * Update Organization
 */
export function useUpdateOrganization(
  organizationId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: EditOrganizationPayload
    ) =>
      organizationApi.update(
        organizationId,
        payload
      ),

    onSuccess: (updatedOrganization) => {
      // Refresh organization list
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all(),
      });

      // Refresh organization detail
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.organizations.detail(
            organizationId
          ),
      });

      toast.success(
        'Organization updated successfully'
      );
    },

    onError,
  });
}


/**
 * Delete Organization
 */
export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      organizationId: string
    ) =>
      organizationApi.delete(
        organizationId
      ),

    onSuccess: (_, organizationId) => {
      // Remove detail cache
      queryClient.removeQueries({
        queryKey:
          queryKeys.organizations.detail(
            organizationId
          ),
      });

      // Refresh list
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all(),
      });

      toast.success(
        'Organization deleted successfully'
      );
    },

    onError,
  });
}


/**
 * Block Organization
 */
export function useBlockOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: string;
      reason?: string;
    }) =>
      organizationApi.block(
        id,
        reason
      ),

    onSuccess: (_, variables) => {
      // Refresh organization list
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all(),
      });

      // Refresh organization detail
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.organizations.detail(
            variables.id
          ),
      });

      toast.success(
        'Organization blocked successfully'
      );
    },

    onError,
  });
}


/**
 * Unblock Organization
 */
export function useUnblockOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      organizationId: string
    ) =>
      organizationApi.unblock(
        organizationId
      ),

    onSuccess: (_, organizationId) => {
      // Refresh organization list
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all(),
      });

      // Refresh organization detail
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.organizations.detail(
            organizationId
          ),
      });

      toast.success(
        'Organization unblocked successfully'
      );
    },

    onError,
  });
}


/**
 * Upgrade Organization Plan
 */
export function useUpgradePlan(
  organizationId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      newPlanId: string
    ) =>
      organizationApi.upgradePlan(
        organizationId,
        newPlanId
      ),

    onSuccess: () => {
      // Organization detail contains currentPlanId
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.organizations.detail(
            organizationId
          ),
      });

      // Organization list also contains currentPlanId
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.organizations.all(),
      });

      toast.success(
        'Subscription plan upgraded successfully'
      );
    },

    onError,
  });
}