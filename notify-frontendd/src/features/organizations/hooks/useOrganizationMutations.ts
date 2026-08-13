'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { organizationApi } from '../api/organization.api';

import { queryKeys } from '@/lib/query/query-keys';
import { ApiClientError } from '@/lib/api/errors';

import {
  CreateOrganizationPayload,
  EditOrganizationPayload,
  ResetAdminPasswordPayload,
  EditOrganizationAdminPayload
} from '../types/organization.types';


function onError(error: ApiClientError) {
  toast.error(error.message);
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload): Promise<CreateOrganizationPayload> =>
      organizationApi.create(payload),
 
    onSuccess: () => {
      // Refresh organization list
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all(),
      });
 
      toast.success('Organization created successfully');
    },
 
    onError,
  });
}

export function useUpdateOrganization(organizationId: string) {
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

// export function useDeleteOrganization() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (
//       organizationId: string
//     ) =>
//       organizationApi.delete(
//         organizationId
//       ),

//     onSuccess: (_, organizationId) => {
//       // Remove detail cache
//       queryClient.removeQueries({
//         queryKey:
//           queryKeys.organizations.detail(
//             organizationId
//           ),
//       });

//       // Refresh list
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.organizations.all(),
//       });

//       toast.success(
//         'Organization deleted successfully'
//       );
//     },

//     onError,
//   });
// }

export function useUpdateOrganizationAdmin(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditOrganizationAdminPayload) =>
      organizationApi.updateAdmin(organizationId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.detail(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all(),
      });

      toast.success("Administrator details updated successfully");
    },

    onError,
  });
}

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

export function useResetAdminPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ResetAdminPasswordPayload;
    }) =>
      organizationApi.resetAdminPassword(
        id,
        payload
      ),

    onSuccess: (_, variables) => {
      // Refresh organization detail
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.organizations.detail(
            variables.id
          ),
      });

      toast.success(
        'Organization admin password updated successfully'
      );
    },

    onError,
  });
}

// export function useResendInvite() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (organizationId: string) =>
//       organizationApi.resendInvite(organizationId),

//     onSuccess: (_, organizationId) => {
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.organizations.all(),
//       });

//       queryClient.invalidateQueries({
//         queryKey: queryKeys.organizations.detail(organizationId),
//       });

//       toast.success("Invitation resent successfully");
//     },

//     onError,
//   });
// }

// export function useCancelInvite() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (organizationId: string) =>
//       organizationApi.cancelInvite(organizationId),

//     onSuccess: (_, organizationId) => {
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.organizations.all(),
//       });

//       queryClient.invalidateQueries({
//         queryKey: queryKeys.organizations.detail(organizationId),
//       });

//       toast.success("Invitation cancelled successfully");
//     },

//     onError,
//   });
// }

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