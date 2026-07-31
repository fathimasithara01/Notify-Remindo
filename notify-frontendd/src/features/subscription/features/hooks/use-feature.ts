import { useQuery } from "@tanstack/react-query";

import { featureApi } from "../api/feature.api";

import { queryKeys } from "@/lib/query/query-keys";

export function useFeature(
  id: string
) {
  return useQuery({
    queryKey: queryKeys.subscriptions.features.detail(id),
    queryFn: () => featureApi.findById(id),
    enabled: !!id,
  });
}