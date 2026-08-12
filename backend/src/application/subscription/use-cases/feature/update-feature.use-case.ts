import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../../infrastructure/di/tokens";
import { IFeatureRepository } from "../../../../domain/repositories/feature.repository.interface";
import { UpdateFeatureInput, Feature } from "../../../../domain/entities/feature.entity";
import { NotFoundError, ConflictError } from "../../../../domain/errors/domain.error";

interface UpdateFeatureCommand {
  featureId: string;
  adminId: string;
  data: UpdateFeatureInput;
}

@injectable()
export class UpdateFeatureUseCase {
  constructor(
    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository: IFeatureRepository
  ) { }

  async execute({ featureId, data }: UpdateFeatureCommand): Promise<Feature> {
    const feature = await this.featureRepository.findById(featureId);
    if (!feature) throw new NotFoundError("Feature not found");

    if (data.title && data.title !== feature.title) {
      const existing = await this.featureRepository.findByTitle(data.title);
      if (existing) throw new ConflictError("A feature with this title already exists");
    }

    const updated = await this.featureRepository.update(featureId, data);
    if (!updated) throw new NotFoundError("Feature not found");

    return updated;
  }
}