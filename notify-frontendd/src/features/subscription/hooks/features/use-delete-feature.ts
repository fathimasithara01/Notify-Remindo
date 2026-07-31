import { useMutation, useQueryClient } from "@tanstack/react-query";

import { featureApi } from "../../api/feature.api";

import { queryKeys } from "@/lib/query/query-keys";

export function useDeleteFeature() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      featureApi.remove,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions.features.all(),
      });

    },

  });

}