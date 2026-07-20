import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';

export interface PlanOrganizationCount {
  planId: string;
  planName: string;
  count: number;
}

export interface BusinessReport {
  totalOrganizations: number;
  activeOrganizations: number;
  blockedOrganizations: number;
  totalActivePlans: number;
  organizationsByPlan: PlanOrganizationCount[];
}

@injectable()
export class GetBusinessReportUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository
  ) { }

  async execute(): Promise<BusinessReport> {
    const [allOrgs, activeOrgs, blockedOrgs, activePlans] = await Promise.all([
      this.orgRepo.list(),
      this.orgRepo.list({ status: 'active' }),
      this.orgRepo.list({ status: 'blocked' }),
      this.planRepo.list({ status: 'active' }),
    ]);

    const organizationsByPlan = activePlans.map((plan) => ({
      planId: plan.id,
      planName: plan.name,
      count: allOrgs.filter(
        (org) => org.currentPlanId === plan.id
      ).length,
    }));

    return {
      totalOrganizations: allOrgs.length,
      activeOrganizations: activeOrgs.length,
      blockedOrganizations: blockedOrgs.length,
      totalActivePlans: activePlans.length,
      organizationsByPlan,
    };
  }
}