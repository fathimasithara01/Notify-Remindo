import {
  FeatureDataType,
  FeatureStatus,
} from "../../domain/entities/feature.entity";


export interface CreateFeatureDto {
  key: string;
  label: string;
  description?: string;
  category?: string;
  dataType: FeatureDataType;
  displayOrder: number;
  status?: FeatureStatus;
}