import {
  FeatureDataType,
} from "../../../domain/entities/feature.entity";


export type PlanFeatureValue =
  | string
  | number
  | boolean;

export interface PlanFeature {

  id: string;


  planId: string;


  featureId: string;


  featureValue: PlanFeatureValue;


  createdAt: Date;


  updatedAt: Date;

}

export interface PlanFeatureWithDefinition extends PlanFeature {

  key: string;


  label: string;


  dataType: FeatureDataType;

}

export type CreatePlanFeatureInput = Omit<   PlanFeature,   "id"   | "createdAt"   | "updatedAt" >;

export interface UpdatePlanFeatureValueInput {

  featureValue: PlanFeatureValue;

}