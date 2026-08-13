import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  SubscriptionPlan,
  CreateSubscriptionPlanInput,
  UpdateSubscriptionPlanInput,
  SubscriptionPlanFilters,
} from '../../types/subscription-plan.types';
import { subscriptionPlanApi } from '../../api/subscription-plan.api';
const PLAN_KEYS = {
  all: ['subscription-plans'] as const,
  lists: () => [...PLAN_KEYS.all, 'list'] as const,
  list: (filters?: SubscriptionPlanFilters) => [...PLAN_KEYS.lists(), filters] as const,
  details: () => [...PLAN_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PLAN_KEYS.details(), id] as const,
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useSubscriptionPlans(filters?: SubscriptionPlanFilters) {
  return useQuery({
    queryKey: PLAN_KEYS.list(filters),
    queryFn: () => subscriptionPlanApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useSubscriptionPlan(id: string) {
  return useQuery({
    queryKey: PLAN_KEYS.detail(id),
    queryFn: () => subscriptionPlanApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPlanInput) =>
      subscriptionPlanApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.lists() });
      toast.success('Plan created');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create plan'));
    },
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSubscriptionPlanInput }) =>
      subscriptionPlanApi.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.detail(variables.id) });
      toast.success('Plan updated');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update plan'));
    },
  });
}

export function useDeleteSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionPlanApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.lists() });
      toast.success('Plan deleted');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete plan'));
    },
  });
}

export function useBlockSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionPlanApi.block(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.detail(id) });
      toast.success('Plan blocked');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to block plan'));
    },
  });
}

export function useUnblockSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionPlanApi.unblock(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PLAN_KEYS.detail(id) });
      toast.success('Plan unblocked');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to unblock plan'));
    },
  });
}