import {
  Currency,
  BillingInterval,
} from "../../domain/entities/subscription-plan.entity";

import {
  FeatureStatus,
} from "../../domain/entities/feature.entity";

export interface CreateSubscriptionPlanDto {


  organizationId:string;


  name:string;


  description?:string;



  priceInMinorUnit:number;



  currency:Currency;



  billingInterval:BillingInterval;



  trialDays?:number;

 status:FeatureStatus;

  features?:Array<{

    featureId:string;

    featureValue:string|number|boolean;

  }>;

}