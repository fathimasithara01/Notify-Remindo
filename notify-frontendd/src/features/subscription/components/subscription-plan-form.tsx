// src/features/subscription/components/subscription-plan-form.tsx

"use client";


import {
  useForm,
} from "react-hook-form";


import {
  zodResolver,
} from "@hookform/resolvers/zod";


import {
  Button,
} from "@/components/ui/button";


import {
  Input,
} from "@/components/ui/input";


import {Textarea} from "@/components/ui/textarea";

import {
  Label,
} from "@/components/ui/label";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import {
  createSubscriptionPlanSchema,
  CreateSubscriptionPlanFormData,
} from "../schemas/subscription-plan.schema";


import {
  useCreateSubscriptionPlan,
} from "../hooks/use-create-subscription-plan";


import {
  useUpdateSubscriptionPlan,
} from "../hooks/use-update-subscription-plan";


import {
  SubscriptionPlan,
} from "../types/subscription-plan.types";




interface SubscriptionPlanFormProps {


  plan?:
    SubscriptionPlan;


  onSuccess?:
    () => void;


}





export function SubscriptionPlanForm({

  plan,

  onSuccess,

}: SubscriptionPlanFormProps) {



  const isEdit =
    Boolean(plan);




  const createMutation =
    useCreateSubscriptionPlan();




  const updateMutation =
    useUpdateSubscriptionPlan();






  const form =
    useForm<CreateSubscriptionPlanFormData>({


      resolver:
        zodResolver(
          createSubscriptionPlanSchema
        ),



      defaultValues:{


        name:
          plan?.name ?? "",



        description:
          plan?.description ?? "",



        priceInMinorUnit:
          plan?.priceInMinorUnit ?? 0,



        currency:
          plan?.currency ?? "INR",



        billingInterval:
          plan?.billingInterval ?? "monthly",



        trialDays:
          plan?.trialDays ?? 0,



        status:
          plan?.status ?? "draft",


      },


    });







  const onSubmit =
    (
      data:
      CreateSubscriptionPlanFormData
    ) => {



      if(isEdit && plan){


        updateMutation.mutate(

          {

            id:
              plan.id,


            data,

          },

          {

            onSuccess:()=>{

              onSuccess?.();

            }

          }

        );


      }

      else{


        createMutation.mutate(

          data,

          {

            onSuccess:()=>{


              form.reset();


              onSuccess?.();


            }


          }

        );


      }



    };






  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;






  return (

    <form

      onSubmit={
        form.handleSubmit(
          onSubmit
        )
      }

      className="
        space-y-5
      "

    >





      <div>

        <Label>
          Plan Name
        </Label>


        <Input

          {...form.register(
            "name"
          )}

          placeholder="Premium Plan"

        />

      </div>







      <div>


        <Label>
          Description
        </Label>


        <Textarea

          {...form.register(
            "description"
          )}

          placeholder="Plan description"

        />


      </div>








      <div>


        <Label>
          Price (Minor Unit)
        </Label>


        <Input

          type="number"

          {...form.register(
            "priceInMinorUnit",
            {
              valueAsNumber:true
            }
          )}

        />


      </div>







      <div>


        <Label>
          Currency
        </Label>


        <Select

          defaultValue={
            plan?.currency ?? "INR"
          }


          onValueChange={
            (value)=>
              form.setValue(
                "currency",
                value as any
              )
          }

        >


          <SelectTrigger>

            <SelectValue />

          </SelectTrigger>


          <SelectContent>

            <SelectItem value="INR">
              INR
            </SelectItem>


            <SelectItem value="USD">
              USD
            </SelectItem>


            <SelectItem value="EUR">
              EUR
            </SelectItem>


          </SelectContent>


        </Select>


      </div>









      <div>


        <Label>
          Billing Interval
        </Label>


        <Select


          defaultValue={
            plan?.billingInterval ??
            "monthly"
          }


          onValueChange={
            (value)=>
              form.setValue(
                "billingInterval",
                value as any
              )
          }


        >


          <SelectTrigger>

            <SelectValue />

          </SelectTrigger>


          <SelectContent>


            <SelectItem value="weekly">
              Weekly
            </SelectItem>


            <SelectItem value="monthly">
              Monthly
            </SelectItem>


            <SelectItem value="yearly">
              Yearly
            </SelectItem>


          </SelectContent>


        </Select>


      </div>







      <div>


        <Label>
          Status
        </Label>


        <Select


          defaultValue={
            plan?.status ??
            "draft"
          }


          onValueChange={
            (value)=>
              form.setValue(
                "status",
                value as any
              )
          }


        >


          <SelectTrigger>

            <SelectValue />

          </SelectTrigger>


          <SelectContent>


            <SelectItem value="draft">
              Draft
            </SelectItem>


            <SelectItem value="active">
              Active
            </SelectItem>


            <SelectItem value="inactive">
              Inactive
            </SelectItem>


          </SelectContent>


        </Select>


      </div>







      <Button

        type="submit"

        disabled={isPending}

      >


        {
          isPending
            ? "Saving..."
            : isEdit
              ? "Update Plan"
              : "Create Plan"
        }


      </Button>





    </form>

  );

}