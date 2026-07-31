import { useMutation, useQueryClient } from "@tanstack/react-query";

import { featureApi } from "../../api/feature.api";

import { queryKeys } from "@/lib/query/query-keys";

export function useCreateFeature() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      featureApi.create,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions.features.all(),
      });

    },

  });

}