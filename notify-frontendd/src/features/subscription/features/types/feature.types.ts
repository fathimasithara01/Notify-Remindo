export const FeatureStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type FeatureStatus = typeof FeatureStatus[keyof typeof FeatureStatus];

export const FeatureDataType = {
  BOOLEAN: "boolean",
  STRING: "string",
  NUMBER: "number",
} as const;

export type FeatureDataType =typeof FeatureDataType[keyof typeof FeatureDataType];

export interface Feature {
  id: string;

  key: string;

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

export type CreateFeatureInput =
  Omit<
    Feature,
    | "id"
    | "deletedAt"
    | "createdAt"
    | "updatedAt"
  >;