import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../../infrastructure/di/tokens";

import {
    IOrganizationSubscriptionRepository,
} from "../../../domain/repositories/organization-subscription.repository.interface";

import {
    IAuditLogRepository,
} from "../../../domain/repositories/audit-log.repository.interface";


import {
    OrganizationSubscription,
} from "../../../domain/entities/organization-subscription.entity";


import {
    BillingInterval,
} from "../../../domain/entities/subscription-plan.entity";


import {
    NotFoundError,
    DomainError,
} from "../../../domain/errors/domain.error";



export interface RenewOrganizationSubscriptionInput {

    subscriptionId: string;

    userId: string;

}




@injectable()
export class RenewOrganizationSubscriptionUseCase {



    constructor(

        @inject(TOKENS.OrganizationSubscriptionRepository)

        private readonly subscriptionRepository:
            IOrganizationSubscriptionRepository,



        @inject(TOKENS.AuditLogRepository)

        private readonly auditLogRepository:
            IAuditLogRepository

    ) { }






    async execute(
        input: RenewOrganizationSubscriptionInput
    ): Promise<OrganizationSubscription> {



        const {
            subscriptionId,
            userId
        } = input;





        const subscription =
            await this.subscriptionRepository.findById(
                subscriptionId
            );




        if (!subscription) {

            throw new NotFoundError(
                "Organization subscription not found"
            );

        }






        if (subscription.status === "cancelled") {

            throw new DomainError(
                "Cancelled subscription cannot be renewed"
            );

        }






        const startDate =
            new Date(subscription.endDate);




        const endDate =
            this.calculateEndDate(
                startDate,
                subscription.billingInterval
            );






        const renewedSubscription =
            await this.subscriptionRepository.renew(

                subscriptionId,

                {
                    startDate,
                    endDate
                }

            );






        if (!renewedSubscription) {

            throw new DomainError(
                "Failed to renew subscription"
            );

        }







        await this.auditLogRepository.create({

            adminId: userId,


            action:
                "RENEW_ORGANIZATION_SUBSCRIPTION",



            targetType:
                "OrganizationSubscription",



            targetId:
                renewedSubscription.id,



            metadata: {

                organizationId:
                    subscription.organizationId,


                planId:
                    subscription.planId,


                previousEndDate:
                    subscription.endDate,


                newEndDate:
                    endDate

            }

        });





        return renewedSubscription;


    }







    private calculateEndDate(

        startDate: Date,

        interval: BillingInterval

    ): Date {


        const date =
            new Date(startDate);



        switch (interval) {



            case "weekly":

                date.setDate(
                    date.getDate() + 7
                );

                break;



            case "monthly":

                date.setMonth(
                    date.getMonth() + 1
                );

                break;



            case "yearly":

                date.setFullYear(
                    date.getFullYear() + 1
                );

                break;


        }



        return date;

    }


}