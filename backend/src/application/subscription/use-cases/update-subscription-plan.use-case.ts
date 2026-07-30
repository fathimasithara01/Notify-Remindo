import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../../infrastructure/di/tokens";

import {
  ISubscriptionPlanRepository,
} from "../../../domain/repositories/subscription-plan.repository.interface";

import {
  IAuditLogRepository,
} from "../../../domain/repositories/audit-log.repository.interface";

import {
  SubscriptionPlan,
} from "../../../domain/entities/subscription-plan.entity";

import {
  NotFoundError,
  DomainError,
} from "../../../domain/errors/domain.error";

import {
  UpdateSubscriptionPlanDto,
} from "../../dtos/update-subscription-plan.dto";



export interface UpdateSubscriptionPlanInput {

  planId: string;

  adminId: string;

  data: UpdateSubscriptionPlanDto;

}



@injectable()
export class UpdateSubscriptionPlanUseCase {


  constructor(

    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly planRepository:
      ISubscriptionPlanRepository,


    @inject(TOKENS.AuditLogRepository)
    private readonly auditLogRepository:
      IAuditLogRepository

  ) {}



  async execute(
    input: UpdateSubscriptionPlanInput
  ): Promise<SubscriptionPlan> {


    const {
      planId,
      adminId,
      data
    } = input;



    const existingPlan =
      await this.planRepository.findById(
        planId
      );



    if (!existingPlan) {

      throw new NotFoundError(
        "Subscription plan not found"
      );

    }



    if (
      data.priceInMinorUnit !== undefined &&
      data.priceInMinorUnit <= 0
    ) {

      throw new DomainError(
        "Price must be greater than zero"
      );

    }



    if (
      data.name !== undefined &&
      !data.name.trim()
    ) {

      throw new DomainError(
        "Plan name cannot be empty"
      );

    }



    const updatedPlan =
      await this.planRepository.update(
        planId,
        {

          ...(data.name && {
            name:data.name.trim()
          }),


          ...(data.description !== undefined && {
            description:data.description
          }),


          ...(data.priceInMinorUnit !== undefined && {
            priceInMinorUnit:
              data.priceInMinorUnit
          }),


          ...(data.currency && {
            currency:data.currency
          }),


          ...(data.billingInterval && {
            billingInterval:
              data.billingInterval
          }),


          ...(data.trialDays !== undefined && {
            trialDays:data.trialDays
          }),


          ...(data.status && {
            status:data.status
          })

        }
      );



    if (!updatedPlan) {

      throw new NotFoundError(
        "Unable to update subscription plan"
      );

    }



    await this.auditLogRepository.create({

      adminId,


      action:
        "UPDATE_SUBSCRIPTION_PLAN",


      targetType:
        "SubscriptionPlan",


      targetId:
        updatedPlan.id,


      metadata:{
        changes:data
      }

    });



    return updatedPlan;

  }

}