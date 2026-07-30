// src/features/subscription/components/subscription-plan-table.tsx


"use client";


import {
  Button,
} from "@/components/ui/button";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import {
  useSubscriptionPlans,
} from "../hooks/use-subscription-plans";


import {
  useDeleteSubscriptionPlan,
} from "../hooks/use-delete-subscription-plan";


import {
  SubscriptionPlan,
} from "../types/subscription-plan.types";




interface SubscriptionPlanTableProps {


  onEdit?:
    (
      plan: SubscriptionPlan
    ) => void;


}





export function SubscriptionPlanTable({
  onEdit,
}: SubscriptionPlanTableProps) {



  const {
    data,
    isLoading,
  } =
    useSubscriptionPlans({

      page:1,

      limit:10,

    });





  const deleteMutation =
    useDeleteSubscriptionPlan();






  if(isLoading){

    return (

      <div>
        Loading subscription plans...
      </div>

    );

  }






  const plans =
    data?.items ?? [];







  return (

    <div
      className="
        rounded-md
        border
      "
    >


      <Table>


        <TableHeader>

          <TableRow>


            <TableHead>
              Name
            </TableHead>


            <TableHead>
              Price
            </TableHead>


            <TableHead>
              Billing
            </TableHead>


            <TableHead>
              Status
            </TableHead>


            <TableHead
              className="text-right"
            >
              Actions
            </TableHead>


          </TableRow>


        </TableHeader>





        <TableBody>



          {
            plans.map(
              (plan)=>(


                <TableRow
                  key={plan.id}
                >


                  <TableCell>

                    <div>

                      <p className="font-medium">

                        {plan.name}

                      </p>


                      {
                        plan.description &&
                        (

                          <p
                            className="
                              text-sm
                              text-muted-foreground
                            "
                          >
                            {plan.description}
                          </p>

                        )
                      }


                    </div>


                  </TableCell>






                  <TableCell>


                    {plan.currency}

                    {" "}

                    {
                      (
                        plan.priceInMinorUnit /
                        100
                      ).toFixed(2)
                    }


                  </TableCell>






                  <TableCell>

                    {plan.billingInterval}

                  </TableCell>






                  <TableCell>

                    {plan.status}

                  </TableCell>






                  <TableCell
                    className="text-right"
                  >



                    <div
                      className="
                        flex
                        justify-end
                        gap-2
                      "
                    >


                      <Button

                        variant="outline"

                        size="sm"

                        onClick={() =>
                          onEdit?.(plan)
                        }

                      >

                        Edit

                      </Button>





                      <Button

                        variant="destructive"

                        size="sm"

                        disabled={
                          deleteMutation.isPending
                        }


                        onClick={() =>
                          deleteMutation.mutate(
                            plan.id
                          )
                        }

                      >

                        {
                          deleteMutation.isPending
                            ? "Deleting..."
                            : "Delete"
                        }


                      </Button>



                    </div>



                  </TableCell>



                </TableRow>


              )

            )
          }





          {
            plans.length === 0 &&
            (

              <TableRow>

                <TableCell
                  colSpan={5}
                  className="text-center"
                >

                  No subscription plans found

                </TableCell>


              </TableRow>

            )
          }





        </TableBody>


      </Table>


    </div>

  );

}