import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../../infrastructure/di/tokens";

import {
    ISubscriptionPlanRepository,
} from "../../../domain/repositories/subscription-plan.repository.interface";

import {
    IFeatureRepository,
} from "../../../domain/repositories/feature.repository.interface";

import {
    IPlanFeatureRepository,
} from "../../../domain/repositories/plan-feature.repository.interface";

import {
    IAuditLogRepository,
} from "../../../domain/repositories/audit-log.repository.interface";


import {
    PlanFeature,
} from "../../../domain/entities/plan-feature.entity";


import {
    FeatureDataType,
} from "../../../domain/entities/feature.entity";


import {
    CreatePlanFeatureDto,
} from "../../dtos/create-plan-feature.dto";


import {
    ConflictError,
    NotFoundError,
    DomainError,
} from "../../../domain/errors/domain.error";



export interface AddPlanFeatureInput {

    data: CreatePlanFeatureDto;

    adminId: string;

}




@injectable()
export class AddPlanFeatureUseCase {



    constructor(

        @inject(TOKENS.SubscriptionPlanRepository)
        private readonly planRepository:
            ISubscriptionPlanRepository,


        @inject(TOKENS.FeatureRepository)
        private readonly featureRepository:
            IFeatureRepository,


        @inject(TOKENS.PlanFeatureRepository)
        private readonly planFeatureRepository:
            IPlanFeatureRepository,


        @inject(TOKENS.AuditLogRepository)
        private readonly auditLogRepository:
            IAuditLogRepository

    ) { }





    async execute(
        input: AddPlanFeatureInput
    ): Promise<PlanFeature> {


        const {
            data,
            adminId
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




        const feature =
            await this.featureRepository.findById(
                data.featureId
            );



        if (!feature) {

            throw new NotFoundError(
                "Feature not found"
            );

        }




        const existing =
            await this.planFeatureRepository
                .findByPlanAndFeature(
                    data.planId,
                    data.featureId
                );



        if (existing) {

            throw new ConflictError(
                "Feature already assigned to this plan"
            );

        }





        this.validateFeatureValue(
            feature.dataType,
            data.featureValue
        );






        const planFeature =
            await this.planFeatureRepository.create({

                planId: data.planId,

                featureId: data.featureId,

                featureValue: data.featureValue

            });






        await this.auditLogRepository.create({

            adminId,

            action: "ADD_PLAN_FEATURE",

            targetType: "PlanFeature",

            targetId: planFeature.id,

            metadata: {

                planId: plan.id,

                featureKey: feature.key

            }

        });





        return planFeature;


    }







    private validateFeatureValue(

        type: FeatureDataType,

        value: unknown

    ): void {


        switch (type) {



            case "boolean":

                if (typeof value !== "boolean") {

                    throw new DomainError(
                        "Feature value must be boolean"
                    );

                }

                break;





            case "number":

                if (
                    typeof value !== "number" ||
                    !Number.isFinite(value)
                ) {

                    throw new DomainError(
                        "Feature value must be valid number"
                    );

                }

                break;





            case "string":

                if (typeof value !== "string") {

                    throw new DomainError(
                        "Feature value must be string"
                    );

                }

                break;





            case "json":

                if (
                    typeof value !== "object" ||
                    value === null ||
                    Array.isArray(value)
                ) {

                    throw new DomainError(
                        "Feature value must be JSON object"
                    );

                }

                break;


        }


    }


}