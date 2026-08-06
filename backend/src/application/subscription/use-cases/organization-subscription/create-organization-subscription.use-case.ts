import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../../../infrastructure/di/tokens";

import {
    IOrganizationSubscriptionRepository,
} from "../../../../domain/repositories/organization-subscription.repository.interface";

import {
    ISubscriptionPlanRepository,
} from "../../../../domain/repositories/subscription-plan.repository.interface";

import {
    OrganizationSubscription,
} from "../../../../domain/entities/organization-subscription.entity";


import {
    DomainError,
    NotFoundError,
    ConflictError,
} from "../../../../domain/errors/domain.error";

import {
    IAuditLogRepository,
} from "../../../../domain/repositories/audit-log.repository.interface";
import { CreateSubscriptionDto } from "../../../dtos/subscription/create-subscription.dto";



export interface CreateOrganizationSubscriptionInput {

    data: CreateSubscriptionDto;

    userId: string;

}



@injectable()
export class CreateOrganizationSubscriptionUseCase {


    constructor(

        @inject(TOKENS.SubscriptionPlanRepository)
        private readonly subscriptionRepository:
            IOrganizationSubscriptionRepository,


        @inject(TOKENS.SubscriptionPlanRepository)
        private readonly planRepository:
            ISubscriptionPlanRepository,


        @inject(TOKENS.AuditLogRepository)
        private readonly auditRepository:
            IAuditLogRepository

    ) { }



    async execute(
        input: CreateOrganizationSubscriptionInput
    ): Promise<OrganizationSubscription> {


        const {
            data,
            userId
        } = input;



        const plan =
            await this.planRepository.findById(
                data.planId
            );



        if (!plan) {

            throw new NotFoundError(
                "Subscription plan not found"
            );

        }



        if (
            plan.status !== "active"
        ) {

            throw new DomainError(
                "Subscription plan is not active"
            );

        }



        const existingSubscription =
            await this.subscriptionRepository
                .findActiveSubscription(
                    data.organizationId
                );



        if (existingSubscription) {

            throw new ConflictError(
                "Organization already has an active subscription"
            );

        }



        const startDate =
            data.startDate ?? new Date();



        const endDate =
            this.calculateEndDate(
                startDate,
                plan.billingInterval,
                plan.trialDays
            );



        const subscription =
            await this.subscriptionRepository.create({

                organizationId:
                    data.organizationId,


                planId:
                    plan.id,


                startDate,


                endDate,


                priceInMinorUnit:
                    plan.priceInMinorUnit,


                currency:
                    plan.currency,


                billingInterval:
                    plan.billingInterval,


                paymentProvider:
                    data.paymentProvider,


                paymentTransactionId: data.paymentTransactionId,
                autoRenew: data.autoRenew ?? false,
                status: "active",
            });



        await this.auditRepository.create({

            adminId:
                userId,


            action:
                "CREATE_ORGANIZATION_SUBSCRIPTION",


            targetType:
                "OrganizationSubscription",


            targetId:
                subscription.id,


            metadata: {

                organizationId:
                    data.organizationId,


                planId:
                    plan.id

            }

        });



        return subscription;

    }



    private calculateEndDate(
        startDate: Date,
        interval:
            | "monthly"
            | "yearly"
            | "weekly",
        trialDays?: number
    ): Date {


        const endDate =
            new Date(startDate);



        if (trialDays && trialDays > 0) {

            endDate.setDate(
                endDate.getDate() + trialDays
            );

            return endDate;

        }



        switch (interval) {

            case "weekly":

                endDate.setDate(
                    endDate.getDate() + 7
                );

                break;



            case "monthly":

                endDate.setMonth(
                    endDate.getMonth() + 1
                );

                break;



            case "yearly":

                endDate.setFullYear(
                    endDate.getFullYear() + 1
                );

                break;

        }


        return endDate;

    }

}