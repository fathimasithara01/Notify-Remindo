import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../../../infrastructure/di/tokens";

import {
    IOrganizationSubscriptionRepository,
} from "../../../../domain/repositories/organization-subscription.repository.interface";

import {
    IAuditLogRepository,
} from "../../../../domain/repositories/audit-log.repository.interface";


import {
    OrganizationSubscription,
} from "../../../../domain/entities/organization-subscription.entity";


import {
    NotFoundError,
    DomainError,
} from "../../../../domain/errors/domain.error";




export interface CancelOrganizationSubscriptionInput {

    subscriptionId: string;

    userId: string;

    reason?: string;

}





@injectable()
export class CancelOrganizationSubscriptionUseCase {



    constructor(


        @inject(TOKENS.SubscriptionPlanRepository)

        private readonly subscriptionRepository:
            IOrganizationSubscriptionRepository,



        @inject(TOKENS.AuditLogRepository)

        private readonly auditLogRepository:
            IAuditLogRepository


    ) { }







    async execute(

        input: CancelOrganizationSubscriptionInput

    ): Promise<OrganizationSubscription> {



        const {
            subscriptionId,
            userId,
            reason
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
                "Subscription is already cancelled"
            );


        }







        const cancelledAt =
            new Date();







        const cancelledSubscription =
            await this.subscriptionRepository.cancel(

                subscriptionId,

                cancelledAt

            );







        if (!cancelledSubscription) {


            throw new DomainError(
                "Failed to cancel subscription"
            );


        }








        await this.auditLogRepository.create({


            adminId: userId,



            action:
                "CANCEL_ORGANIZATION_SUBSCRIPTION",



            targetType:
                "OrganizationSubscription",



            targetId:
                cancelledSubscription.id,



            metadata: {


                organizationId:
                    subscription.organizationId,


                planId:
                    subscription.planId,


                reason:
                    reason ?? null,


                cancelledAt


            }


        });

        return cancelledSubscription;


    }



}