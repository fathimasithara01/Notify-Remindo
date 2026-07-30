export interface CreatePlanFeatureDto {
  planId: string;
  featureId: string;
  featureValue: string | number | boolean;
}