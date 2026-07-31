import { useMutation, useQueryClient } from "@tanstack/react-query";

import { featureApi } from "../../api/feature.api";



import { queryKeys } from "@/lib/query/query-keys";
import { CreateFeatureInput } from "../../types/feature.types";

interface UpdateFeaturePayload {
  id: string;
  data: Partial<CreateFeatureInput>;
}

export function useUpdateFeature() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      ({
        id,
        data,
      }: UpdateFeaturePayload) =>
        featureApi.update(
          id,
          data
        ),

    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions.features.all(),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.subscriptions.features.detail(
            variables.id
          ),
      });

    },

  });

}