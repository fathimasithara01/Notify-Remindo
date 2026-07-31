export interface PlanFeature {
  id: string;

  planId: string;

  featureId: string;

  value?: string | number | boolean | null;

  createdAt: string;
  updatedAt: string;
}

export interface PlanFeatureWithDetails
  extends PlanFeature {
  feature?: {
    id: string;
    key: string;
    label: string;
    description?: string;
    category?: string;
    dataType:
      | "boolean"
      | "string"
      | "number";
    status: "active" | "inactive";
  };

  plan?: {
    id: string;
    name: string;
  };
}

export interface CreatePlanFeatureInput {
  planId: string;
  featureId: string;
  value?: string | number | boolean | null;
}

export interface UpdatePlanFeatureInput {
  value?: string | number | boolean | null;
}

export interface PlanFeatureListResponse {
  items: PlanFeatureWithDetails[];
  total: number;
}