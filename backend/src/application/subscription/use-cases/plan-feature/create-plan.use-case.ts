// import { inject, injectable } from "tsyringe";

// import { TOKENS } from "../../../../infrastructure/di/tokens";

// import {
//   ISubscriptionPlanRepository,
// } from "../../../../domain/repositories/subscription-plan.repository.interface";

// import {
//   IAuditLogRepository,
// } from "../../../../domain/repositories/audit-log.repository.interface";

// import {
//   SubscriptionPlan,
// } from "../../../../domain/entities/subscription-plan.entity";

// import {
//   DomainError,
// } from "../../../../domain/errors/domain.error";

// import {
//   CreateSubscriptionPlanDto,
// } from "../../../dtos/create-subscription-plan.dto";



// export interface CreateSubscriptionPlanInput {

//   data: CreateSubscriptionPlanDto;

//   adminId: string;

// }



// @injectable()
// export class CreateSubscriptionPlanUseCase {


//   constructor(

//     @inject(TOKENS.SubscriptionPlanRepository)
//     private readonly planRepository:
//       ISubscriptionPlanRepository,


//     @inject(TOKENS.AuditLogRepository)
//     private readonly auditLogRepository:
//       IAuditLogRepository

//   ) {}



//   async execute(  input: CreateSubscriptionPlanInput): Promise<SubscriptionPlan> {
//     const {
//       data,
//       adminId
//     } = input;



//     const planName = data.name.trim();



//     if (!planName) {

//       throw new DomainError(
//         "Plan name is required"
//       );

//     }



//     if (data.priceInMinorUnit <= 0) {

//       throw new DomainError(
//         "Price must be greater than zero"
//       );

//     }



//     if (
//       data.trialDays !== undefined &&
//       data.trialDays < 0
//     ) {

//       throw new DomainError(
//         "Trial days cannot be negative"
//       );

//     }



//     const existingPlan =
//       await this.planRepository.existsByName(
//         planName
//       );



//     if (existingPlan) {

//       throw new DomainError(
//         "Subscription plan already exists"
//       );

//     }



//     const plan =
//       await this.planRepository.create({

//         organizationId:
//           data.organizationId,


//         name:
//           planName,


//         description:
//           data.description,


//         priceInMinorUnit:
//           data.priceInMinorUnit,


//         currency:
//           data.currency,


//         billingInterval:
//           data.billingInterval,


//         trialDays:
//           data.trialDays ?? 0,


//         status:
//           data.status ?? "draft",


//       });



//     await this.auditLogRepository.create({

//       adminId,


//       action:
//         "CREATE_SUBSCRIPTION_PLAN",


//       targetType:
//         "SubscriptionPlan",


//       targetId:
//         plan.id,


//       metadata: {

//         name:
//           plan.name

//       }

//     });



//     return plan;

//   }

// }