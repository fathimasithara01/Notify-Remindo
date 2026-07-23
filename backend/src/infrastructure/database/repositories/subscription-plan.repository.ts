import { injectable } from 'tsyringe';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';
import {
  SubscriptionPlan,
  NewSubscriptionPlan,
} from '../../../domain/entities/subscription-plan.entity';
import {
  PlanFeature,
  NewPlanFeature,
  PlanFeatureWithDefinition,
} from '../../../domain/entities/plan-feature.entity';
import {
  OrganizationSubscription,
  NewOrganizationSubscription,
} from '../../../domain/entities/organization-subscription.entity';
import { SubscriptionPlanModel, SubscriptionPlanDocument } from '../models/subscription-plan.model';
import { PlanFeatureModel, PlanFeatureDocument } from '../models/plan-feature.model';
import { FeatureModel } from '../models/feature.model';
import {
  OrganizationSubscriptionModel,
  OrganizationSubscriptionDocument,
} from '../models/organization-subscription.model';

@injectable()
export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
  async create(data: NewSubscriptionPlan): Promise<SubscriptionPlan> {
    const doc = await SubscriptionPlanModel.create(data);
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const doc = await SubscriptionPlanModel.findOne({ _id: id, deletedAt: null });
    return doc ? this.toDomain(doc) : null;
  }

  async update(id: string, data: Partial<NewSubscriptionPlan>): Promise<SubscriptionPlan | null> {
    const doc = await SubscriptionPlanModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await SubscriptionPlanModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date(), status: 'inactive' }
    );
    return result !== null;
  }

  async list(filter?: {
    status?: 'active' | 'inactive';
    search?: string;
  }): Promise<SubscriptionPlan[]> {
    const query: Record<string, unknown> = { deletedAt: null };
    if (filter?.status) query.status = filter.status;
    if (filter?.search) {
      query.name = new RegExp(filter.search.trim(), 'i');
    }

    const docs = await SubscriptionPlanModel.find(query);
    return docs.map((doc) => this.toDomain(doc));
  }

  async setFeature(data: NewPlanFeature): Promise<PlanFeature> {
    const doc = await PlanFeatureModel.findOneAndUpdate(
      { planId: data.planId, featureId: data.featureId },
      { featureValue: data.featureValue },
      { new: true, upsert: true }
    );
    return this.featureToDomain(doc!);
  }

  async removeFeature(planId: string, featureId: string): Promise<boolean> {
    const result = await PlanFeatureModel.findOneAndDelete({ planId, featureId });
    return result !== null;
  }

  async listFeatures(planId: string): Promise<PlanFeatureWithDefinition[]> {
    const links = await PlanFeatureModel.find({ planId });
    const featureIds = links.map((link) => link.featureId);
    const featureDefs = await FeatureModel.find({ _id: { $in: featureIds } });
    const defMap = new Map(featureDefs.map((f) => [f._id.toString(), f]));

    return links.map((link) => {
      const def = defMap.get(link.featureId.toString());
      return {
        ...this.featureToDomain(link),
        key: def?.key ?? '',
        label: def?.label ?? '',
        dataType: def?.dataType ?? 'string',
      };
    });
  }

  async createSubscriptionRecord(
    data: NewOrganizationSubscription
  ): Promise<OrganizationSubscription> {
    const doc = await OrganizationSubscriptionModel.create(data);
    return this.subscriptionToDomain(doc);
  }

  async listSubscriptionHistory(organizationId: string): Promise<OrganizationSubscription[]> {
    const docs = await OrganizationSubscriptionModel.find({ organizationId }).sort({
      createdAt: -1,
    });
    return docs.map((doc) => this.subscriptionToDomain(doc));
  }

  async closeSubscriptionRecord(
    id: string,
    newStatus: 'upgraded' | 'expired' | 'cancelled'
  ): Promise<void> {
    await OrganizationSubscriptionModel.findByIdAndUpdate(id, { status: newStatus });
  }

  private toDomain(doc: SubscriptionPlanDocument): SubscriptionPlan {
    return {
      id: doc._id.toString(),
      name: doc.name,
      userLimit: doc.userLimit,
      durationDays: doc.durationDays,
      price: doc.price,
      status: doc.status,
      description: doc.description,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private featureToDomain(doc: PlanFeatureDocument): PlanFeature {
    return {
      id: doc._id.toString(),
      planId: doc.planId.toString(),
      featureId: doc.featureId.toString(),
      featureValue: doc.featureValue,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private subscriptionToDomain(doc: OrganizationSubscriptionDocument): OrganizationSubscription {
    return {
      id: doc._id.toString(),
      organizationId: doc.organizationId.toString(),
      planId: doc.planId.toString(),
      startDate: doc.startDate,
      endDate: doc.endDate,
      status: doc.status,
      createdAt: doc.createdAt,
    };
  }
}