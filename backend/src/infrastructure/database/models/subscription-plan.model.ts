import { Document, Schema, model , Types} from "mongoose";

import {
  SubscriptionPlanStatus,
  Currency,
  BillingInterval,
} from "../../../domain/entities/subscription-plan.entity";



export interface SubscriptionPlanDocument extends Document {


  organizationId: Types.ObjectId;


  name: string;


  description?: string;



  priceInMinorUnit: number;



  currency: Currency;



  billingInterval: BillingInterval;



  trialDays?: number;



  status: SubscriptionPlanStatus;



  deletedAt: Date | null;



  createdAt: Date;


  updatedAt: Date;

}



const subscriptionPlanSchema =
  new Schema<SubscriptionPlanDocument>(

    {


      organizationId: {

        type: Schema.Types.ObjectId,

        required: true,

        index: true,

      },



      name: {

        type: String,

        required: true,

        trim: true,

        minlength: 2,

        maxlength: 100,

      },



      description: {

        type: String,

        trim: true,

        maxlength: 500,

      },



      priceInMinorUnit: {

        type: Number,

        required: true,

        min: 0,

      },



      currency: {

        type: String,

        required: true,

        uppercase: true,

        enum: [
          "USD",
          "EUR",
          "INR"
        ],

        default: "INR",

      },



      billingInterval: {

        type: String,

        required: true,

        enum: [
          "weekly",
          "monthly",
          "yearly"
        ],

      },



      trialDays: {

        type: Number,

        default: 0,

        min: 0,

      },



      status: {

        type: String,

        enum: [
          "draft",
          "active",
          "inactive"
        ],

        default: "draft",

        index: true,

      },



      deletedAt: {

        type: Date,

        default: null,

        index: true,

      },


    },

    {

      timestamps: true,

      versionKey: false,

    }

  );



subscriptionPlanSchema.index({
  organizationId: 1,
  name: 1,
  deletedAt: 1,
});


subscriptionPlanSchema.index({
  status: 1,
  deletedAt: 1,
});



export const SubscriptionPlanModel =
  model<SubscriptionPlanDocument>(
    "SubscriptionPlan",
    subscriptionPlanSchema
  );