export const FeatureStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type FeatureStatus = typeof FeatureStatus[keyof typeof FeatureStatus];

export type FeatureDataType =
  | "boolean"
  | "number"
  | "string"
  | "json";

export interface Feature {
  id: string;

  key: string; //System internal identifier.
  label: string;

  description?: string;
  category?: string;

  dataType: FeatureDataType;
  displayOrder?: number;
  status: FeatureStatus;

  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateFeatureInput {
  label?: string;
  description?: string;
  category?: string;
  displayOrder?: number;
  status?: FeatureStatus;
}

export type CreateFeatureInput =
  Omit<
    Feature,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  >;


  // [
  // {
  //   id: "1",
  //   key: "max_users",
  //   label: "Maximum Users",
  //   description: "Maximum users allowed",
  //   category: "Users",
  //   dataType: "number",
  //   status: "active"
  // },
  // {
  //   id: "2",
  //   key: "api_access",
  //   label: "API Access",
  //   category: "Integrations",
  //   dataType: "boolean",
  //   status: "active"
  // },
  // {
  //   id: "3",
  //   key: "storage_limit",
  //   label: "Storage Limit",
  //   category: "Storage",
  //   dataType: "number",
  //   status: "active"
  // }
// ]