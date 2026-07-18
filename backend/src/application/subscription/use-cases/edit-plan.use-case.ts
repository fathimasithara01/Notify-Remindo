import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { NotFoundError } from '../../../domain/errors/domain.error';

export interface EditPlanDto {
  name?: string;
  userLimit?: number;
  durationDays?: number;
  price?: number;
  description?: string;
  status?: 'active' | 'inactive';
}

@injectable()
export class EditPlanUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository
  ) {}

  async execute(planId: string, data: EditPlanDto): Promise<SubscriptionPlan> {
    const updated = await this.planRepo.update(planId, data);
    if (!updated) {
      throw new NotFoundError('Subscription plan not found');
    }
    return updated;
  }
}