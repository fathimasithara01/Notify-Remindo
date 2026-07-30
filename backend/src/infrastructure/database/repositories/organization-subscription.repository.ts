import { injectable } from "tsyringe";

import {
    IOrganizationSubscriptionRepository,
    OrganizationSubscriptionListFilters,
    OrganizationSubscriptionListResult,
} from "../../../domain/repositories/organization-subscription.repository.interface";

import {
    OrganizationSubscription,
    CreateOrganizationSubscriptionInput,
    OrganizationSubscriptionStatus,
} from "../../../domain/entities/organization-subscription.entity";

import {
    OrganizationSubscriptionModel,
    OrganizationSubscriptionDocument,
} from "../models/organization-subscription.model";

@injectable()
export class OrganizationSubscriptionRepository
    implements IOrganizationSubscriptionRepository {

    async create(
        data: CreateOrganizationSubscriptionInput
    ): Promise<OrganizationSubscription> {

        const doc = await OrganizationSubscriptionModel.create(data);

        return this.toDomain(doc);
    }

    async findById(
        id: string
    ): Promise<OrganizationSubscription | null> {

        const doc = await OrganizationSubscriptionModel.findById(id);

        return doc
            ? this.toDomain(doc)
            : null;
    }

    async findActiveSubscription(
        organizationId: string
    ): Promise<OrganizationSubscription | null> {

        const doc = await OrganizationSubscriptionModel.findOne({
            organizationId,
            status: "active",
        });

        return doc
            ? this.toDomain(doc)
            : null;
    }

    async listHistory(
        filters: OrganizationSubscriptionListFilters
    ): Promise<OrganizationSubscriptionListResult> {

        const page = filters.page ?? 1;
        const limit = filters.limit ?? 10;

        const query: Record<string, unknown> = {
            organizationId: filters.organizationId,
        };

        if (filters.status) {
            query.status = filters.status;
        }

        const [docs, total] = await Promise.all([

            OrganizationSubscriptionModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),

            OrganizationSubscriptionModel.countDocuments(query),

        ]);

        return {
            items: docs.map(doc => this.toDomain(doc)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateStatus(
        id: string,
        data: {
            status: OrganizationSubscriptionStatus;
            cancelledAt?: Date | null;
        }
    ): Promise<OrganizationSubscription | null> {

        const doc = await OrganizationSubscriptionModel.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );

        return doc
            ? this.toDomain(doc)
            : null;
    }

    async cancel(
        id: string,
        cancelledAt: Date
    ): Promise<OrganizationSubscription | null> {

        const doc =
            await OrganizationSubscriptionModel.findByIdAndUpdate(
                id,
                {
                    status: "cancelled",
                    cancelledAt,
                    autoRenew: false,
                    nextBillingDate: null,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        return doc
            ? this.toDomain(doc)
            : null;
    }

    async renew(
        id: string,
        data: {
            startDate: Date;
            endDate: Date;
        }
    ): Promise<OrganizationSubscription | null> {

        const doc =
            await OrganizationSubscriptionModel.findByIdAndUpdate(
                id,
                {
                    startDate: data.startDate,
                    endDate: data.endDate,
                    nextBillingDate: data.endDate,
                    status: "active",
                    cancelledAt: null,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        return doc
            ? this.toDomain(doc)
            : null;
    }

    private toDomain(
        doc: OrganizationSubscriptionDocument
    ): OrganizationSubscription {

        return {
            id: doc._id.toString(),

            organizationId: doc.organizationId.toString(),

            planId: doc.planId.toString(),

            startDate: doc.startDate,

            endDate: doc.endDate,

            nextBillingDate: doc.nextBillingDate ?? null,

            priceInMinorUnit: doc.priceInMinorUnit,

            currency: doc.currency,

            billingInterval: doc.billingInterval,

            paymentProvider: doc.paymentProvider ?? undefined,

            paymentTransactionId: doc.paymentTransactionId ?? undefined,

            autoRenew: doc.autoRenew,

            status: doc.status,

            cancelledAt: doc.cancelledAt ?? null,

            createdAt: doc.createdAt,

            updatedAt: doc.updatedAt,
        };
    }
}