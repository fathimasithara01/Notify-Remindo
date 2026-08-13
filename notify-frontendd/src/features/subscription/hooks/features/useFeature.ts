import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { featureApi } from '../../api/feature.api';
import { CreateFeatureInput, FeatureFilters, UpdateFeatureInput } from '../../types/feature.types';


const FEATURE_KEYS = {
  all: ['features'] as const,
  lists: () => [...FEATURE_KEYS.all, 'list'] as const,
  list: (filters?: FeatureFilters) => [...FEATURE_KEYS.lists(), filters] as const,
  details: () => [...FEATURE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...FEATURE_KEYS.details(), id] as const,
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useFeatures(filters?: FeatureFilters) {
  return useQuery({
    queryKey: FEATURE_KEYS.list(filters),
    queryFn: () => featureApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useFeature(id: string) {
  return useQuery({
    queryKey: FEATURE_KEYS.detail(id),
    queryFn: () => featureApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFeatureInput) => featureApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.lists() });
      toast.success('Feature created');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create feature'));
    },
  });
}

export function useUpdateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFeatureInput }) =>
      featureApi.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.detail(variables.id) });
      toast.success('Feature updated');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update feature'));
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.lists() });
      toast.success('Feature deleted');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete feature'));
    },
  });
}

export function useBlockFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureApi.block(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.detail(id) });
      toast.success('Feature blocked');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to block feature'));
    },
  });
}

export function useUnblockFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureApi.unblock(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.detail(id) });
      toast.success('Feature unblocked');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to unblock feature'));
    },
  });
}