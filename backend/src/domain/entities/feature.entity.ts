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