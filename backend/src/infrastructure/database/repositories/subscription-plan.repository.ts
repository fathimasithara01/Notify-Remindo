import { injectable } from "tsyringe";

import {
  ISubscriptionPlanRepository,
  SubscriptionPlanListFilters,
  SubscriptionPlanListResult,
} from "../../../domain/repositories/subscription-plan.repository.interface";

import {
  SubscriptionPlan,
  CreateSubscriptionPlanInput,
} from "../../../domain/entities/subscription-plan.entity";

import {
  SubscriptionPlanModel,
  SubscriptionPlanDocument,
} from "../models/subscription-plan.model";

@injectable()
export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
  async create(data: CreateSubscriptionPlanInput): Promise<SubscriptionPlan> {
    const doc = await SubscriptionPlanModel.create(data);
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const doc = await SubscriptionPlanModel.findOne({
      _id: id,
      deletedAt: null,
    });

    return doc ? this.toDomain(doc) : null;
  }

  async findByTitle(title: string): Promise<SubscriptionPlan | null> {
    const doc = await SubscriptionPlanModel.findOne({
      title,
      deletedAt: null,
    });

    return doc ? this.toDomain(doc) : null;
  }

  async update(
    id: string,
    data: Partial<CreateSubscriptionPlanInput>
  ): Promise<SubscriptionPlan | null> {
    const doc = await SubscriptionPlanModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      data,
      { new: true }
    );

    return doc ? this.toDomain(doc) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await SubscriptionPlanModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date(), status: "inactive" }
    );

    return !!result;
  }

  async findActivePlans(): Promise<SubscriptionPlan[]> {
    const docs = await SubscriptionPlanModel.find({
      status: "active",
      deletedAt: null,
    });

    return docs.map((doc) => this.toDomain(doc));
  }

  async countByFeatureId(featureId: string): Promise<number> {
    return SubscriptionPlanModel.countDocuments({
      featureIds: featureId,
      deletedAt: null,
    });
  }

  async list(filters?: SubscriptionPlanListFilters): Promise<SubscriptionPlanListResult> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;

    const query: Record<string, unknown> = {
      deletedAt: null,
    };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.search) {
      query.title = {
        $regex: filters.search,
        $options: "i",
      };
    }

    const [docs, total] = await Promise.all([
      SubscriptionPlanModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit),
      SubscriptionPlanModel.countDocuments(query),
    ]);

    return {
      items: docs.map((doc) => this.toDomain(doc)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private toDomain(doc: SubscriptionPlanDocument): SubscriptionPlan {
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      amountValue: doc.amountValue,
      currency: doc.currency,
      userLimit: doc.userLimit,
      storageLimit: doc.storageLimit,
      featureIds: doc.featureIds,
      status: doc.status,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}