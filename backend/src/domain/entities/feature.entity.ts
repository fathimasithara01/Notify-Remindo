export type FeatureDataType = 'boolean' | 'number' | 'string';
export type FeatureStatus = 'active' | 'inactive';

export interface Feature {
  id: string;
  key: string; 
  label: string;
  dataType: FeatureDataType;
  status: FeatureStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type NewFeature = Omit<Feature, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: FeatureStatus;
};