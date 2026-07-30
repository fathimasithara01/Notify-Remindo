import {
  Schema,
  model,
  Types,
  Document,
} from "mongoose";

import {
  OrganizationSubscriptionStatus,
} from "../../../domain/entities/organization-subscription.entity";

import {
  Currency,
  BillingInterval,
} from "../../../domain/entities/subscription-plan.entity";



export interface OrganizationSubscriptionDocument
  extends Document {


  organizationId: Types.ObjectId;


  planId: Types.ObjectId;



  startDate: Date;



  endDate: Date;



  nextBillingDate?: Date | null;



  priceInMinorUnit: number;



  currency: Currency;



  billingInterval: BillingInterval;



  paymentProvider?: string;



  paymentTransactionId?: string;



  autoRenew: boolean;



  status: OrganizationSubscriptionStatus;



  cancelledAt?: Date | null;



  createdAt: Date;


  updatedAt: Date;

}



const organizationSubscriptionSchema =
  new Schema<OrganizationSubscriptionDocument>(

    {


      organizationId: {

        type: Schema.Types.ObjectId,

        ref: "Organization",

        required: true,

        index: true,

      },



      planId: {

        type: Schema.Types.ObjectId,

        ref: "SubscriptionPlan",

        required: true,

        index: true,

      },



      startDate: {

        type: Date,

        required: true,

      },



      endDate: {

        type: Date,

        required: true,

      },



      nextBillingDate: {

        type: Date,

        default: null,

      },



      priceInMinorUnit: {

        type: Number,

        required: true,

        min: 0,

      },



      currency: {

        type: String,

        enum: [
          "USD",
          "EUR",
          "INR",
        ],

        required: true,

        uppercase: true,

      },



      billingInterval: {

        type: String,

        enum: [
          "weekly",
          "monthly",
          "yearly",
        ],

        required: true,

      },



      paymentProvider: {

        type: String,

        trim: true,

      },



      paymentTransactionId: {

        type: String,

        trim: true,

      },



      autoRenew: {

        type: Boolean,

        default: false,

      },



      status: {

        type: String,

        enum: [
          "active",
          "upgraded",
          "expired",
          "cancelled",
        ],

        default: "active",

        index: true,

      },



      cancelledAt: {

        type: Date,

        default: null,

      },


    },

    {

      timestamps: true,

      versionKey:false,

    }

  );
// Active subscription per organization
organizationSubscriptionSchema.index(
{
 organizationId:1,
 status:1
},
{
 unique:true,
 partialFilterExpression:{
   status:"active"
 }
});


// Subscription history
organizationSubscriptionSchema.index({
 organizationId:1,
 createdAt:-1
});


// Expiry scheduler
organizationSubscriptionSchema.index({
 endDate:1,
 status:1
});


// Payment lookup
organizationSubscriptionSchema.index(
{
 paymentTransactionId:1
},
{
 unique:true,
 sparse:true
});


// Cancellation reports
organizationSubscriptionSchema.index({
 cancelledAt:1
});

export const OrganizationSubscriptionModel =
  model<OrganizationSubscriptionDocument>(
    "OrganizationSubscription",
    organizationSubscriptionSchema
  );