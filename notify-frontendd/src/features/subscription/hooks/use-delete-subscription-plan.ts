import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  subscriptionPlanApi,
} from "../api/subscription-plan.api";


import {
  queryKeys,
} from "@/lib/query/query-keys";





export function useDeleteSubscriptionPlan() {


  const queryClient =
    useQueryClient();




  return useMutation({



    mutationFn:
      (
        id:string
      ) => {


        return subscriptionPlanApi.remove(
          id
        );


      },





    onSuccess:
      (
        _,
        id
      ) => {



        // Remove detail cache

        queryClient.removeQueries({

          queryKey:
            queryKeys.subscriptions.plans.detail(
              id
            ),

        });





        // Refresh list

        queryClient.invalidateQueries({

          queryKey:
            queryKeys.subscriptions.plans.all(),

        });


      },



  });


}