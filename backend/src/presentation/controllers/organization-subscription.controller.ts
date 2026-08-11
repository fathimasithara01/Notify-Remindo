import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../infrastructure/di/tokens";

import {
  IOrganizationSubscriptionRepository,
} from "../../domain/repositories/organization-subscription.repository.interface";

import {
  CreateOrganizationSubscriptionUseCase,
} from "../../application/subscription/use-cases/organization-subscription/create-organization-subscription.use-case";

import {
  RenewOrganizationSubscriptionUseCase,
} from "../../application/subscription/use-cases/organization-subscription/renew-organization-subscription.use-case";

import {
  CancelOrganizationSubscriptionUseCase,
} from "../../application/subscription/use-cases/organization-subscription/cancel-organization-subscription.use-case";

import {
  ApiResponse,
} from "../../shared/utils/api-response";

import {
  UnauthorizedError,
  NotFoundError,
} from "../../domain/errors/domain.error";



@injectable()
export class OrganizationSubscriptionController {

  constructor(

    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly organizationSubscriptionRepository:
      IOrganizationSubscriptionRepository,

    @inject(TOKENS.CreateOrganizationSubscriptionUseCase)
    private readonly createOrganizationSubscriptionUseCase:
      CreateOrganizationSubscriptionUseCase,

    @inject(TOKENS.RenewOrganizationSubscriptionUseCase)
    private readonly renewOrganizationSubscriptionUseCase:
      RenewOrganizationSubscriptionUseCase,

    @inject(TOKENS.CancelOrganizationSubscriptionUseCase)
    private readonly cancelOrganizationSubscriptionUseCase:
      CancelOrganizationSubscriptionUseCase,

  ) {}

    createSubscription = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    if (!req.user) {
      throw new UnauthorizedError();
    }

    const subscription =
      await this.createOrganizationSubscriptionUseCase.execute({

        data: req.body,

        userId: req.user.id,

      });

    ApiResponse.created(
      res,
      subscription,
      "Organization subscription created successfully"
    );

  };



  getActiveSubscription = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    const subscription =
      await this.organizationSubscriptionRepository
        .findActiveSubscription(
          req.params.organizationId
        );

    if (!subscription) {

      throw new NotFoundError(
        "Active organization subscription not found"
      );

    }

    ApiResponse.success(
      res,
      subscription
    );

  };
    listSubscriptionHistory = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    const result =
      await this.organizationSubscriptionRepository.listHistory({

        organizationId:
          req.params.organizationId,

        status:
          req.query.status as
            | "active"
            | "upgraded"
            | "expired"
            | "cancelled"
            | undefined,

        page:
          req.query.page
            ? Number(req.query.page)
            : 1,

        limit:
          req.query.limit
            ? Number(req.query.limit)
            : 10,

      });

    ApiResponse.success(
      res,
      result
    );

  };



  renewSubscription = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    if (!req.user) {
      throw new UnauthorizedError();
    }

    const subscription =
      await this.renewOrganizationSubscriptionUseCase.execute({

        subscriptionId:
          req.params.id,

        userId:
          req.user.id,

      });

    ApiResponse.success(
      res,
      subscription,
      200,
      "Organization subscription renewed successfully"
    );

  };

    cancelSubscription = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    if (!req.user) {
      throw new UnauthorizedError();
    }

    const subscription =
      await this.cancelOrganizationSubscriptionUseCase.execute({

        subscriptionId:
          req.params.id,

        userId:
          req.user.id,

        reason:
          req.body.reason,

      });

    ApiResponse.success(
      res,
      subscription,
      200,
      "Organization subscription cancelled successfully"
    );

  };

}