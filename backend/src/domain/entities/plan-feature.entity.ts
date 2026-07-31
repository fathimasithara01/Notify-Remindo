import {
  FeatureDataType,
} from "./feature.entity";

export type PlanFeatureValue =
  | string
  | boolean
  | number;


export interface PlanFeature {
  id: string;
  planId: string;
  featureId: string;

  featureValue: PlanFeatureValue;

  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


export type CreatePlanFeatureInput =
  Omit<
    PlanFeature,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  >;


export interface PlanFeatureWithDefinition extends PlanFeature {

  key: string;

  label: string;

  dataType: FeatureDataType;

}

// const planFeatures: PlanFeature[] = [
//   {
//     id: "pf1",
//     planId: "plan1",
//     featureId: "feature1",
//     featureValue: 10,
//     deletedAt: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "pf2",
//     planId: "plan1",
//     featureId: "feature2",
//     featureValue: false,
//     deletedAt: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "pf3",
//     planId: "plan1",
//     featureId: "feature3",
//     featureValue: 5,
//     deletedAt: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "pf4",
//     planId: "plan2",
//     featureId: "feature1",
//     featureValue: 100,
//     deletedAt: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "pf5",
//     planId: "plan2",
//     featureId: "feature2",
//     featureValue: true,
//     deletedAt: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "pf6",
//     planId: "plan2",
//     featureId: "feature3",
//     featureValue: 50,
//     deletedAt: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];