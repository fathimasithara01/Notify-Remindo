import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { featureApi } from '../../api/feature.api';
import { CreateFeatureInput, FeatureFilters, UpdateFeatureInput } from '../../types/feature.types';


const FEATURE_KEYS = {
  all: ['features'] as const,
  lists: () => [...FEATURE_KEYS.all, 'list'] as const,
  list: (filters?: FeatureFilters) => [...FEATURE_KEYS.lists(), filters] as const,
  details: () => [...FEATURE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...FEATURE_KEYS.details(), id] as const,
};

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
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.lists() });
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
    },
  });
}