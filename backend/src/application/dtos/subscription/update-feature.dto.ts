import {
  FeatureStatus,
} from "../../../domain/entities/feature.entity";


export interface UpdateFeatureDto {
  label?: string;
  description?: string;
  category?: string;
  displayOrder?: number;
  status?: FeatureStatus;
}