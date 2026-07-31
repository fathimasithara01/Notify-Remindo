import { useQuery } from "@tanstack/react-query";

import {
  featureApi,
  FeatureListParams,
} from "../../api/feature.api";

import { queryKeys } from "@/lib/query/query-keys";

export function useFeatures(
  params?: FeatureListParams
) {
  return useQuery({
    queryKey: queryKeys.subscriptions.features.list(params),
    queryFn: () => featureApi.list(params),
  });
}