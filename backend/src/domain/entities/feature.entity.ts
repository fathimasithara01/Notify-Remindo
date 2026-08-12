export const FeatureStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type FeatureStatus =
  (typeof FeatureStatus)[keyof typeof FeatureStatus];


export interface Feature {
  id: string;

  title: string;
  description?: string;

  category?: string;
  status: FeatureStatus;

  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateFeatureInput = Omit<
  Feature,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

export type UpdateFeatureInput = Partial<
  Omit<CreateFeatureInput, "status">
> & {
  status?: FeatureStatus;
};