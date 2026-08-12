import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../../infrastructure/di/tokens";
import { IFeatureRepository } from "../../../../domain/repositories/feature.repository.interface";
import { CreateFeatureInput, Feature, FeatureStatus } from "../../../../domain/entities/feature.entity";
import { ConflictError } from "../../../../domain/errors/domain.error";

interface CreateFeatureCommand {
  data: CreateFeatureInput;
  adminId: string;
}

@injectable()
export class CreateFeatureUseCase {
  constructor(
    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository: IFeatureRepository
  ) {}

  async execute({ data }: CreateFeatureCommand): Promise<Feature> {
    const existing = await this.featureRepository.findByTitle(data.title);
    if (existing) {
      throw new ConflictError("A feature with this title already exists");
    }

    return this.featureRepository.create({
      ...data,
      status: data.status ?? FeatureStatus.ACTIVE,
    });
  }
}