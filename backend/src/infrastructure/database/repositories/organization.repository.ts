import { injectable } from 'tsyringe';
import { IOrganizationRepository, OrganizationListFilters, OrganizationListResult } from '../../../domain/repositories/organization.repository.interface';
import { Organization, NewOrganization, OrganizationWithAdmin } from '../../../domain/entities/organization.entity';
import { OrganizationModel, OrganizationDocument } from '../models/organization.model';
import { Types } from 'mongoose';

@injectable()
export class OrganizationRepository implements IOrganizationRepository {

  async create(data: NewOrganization): Promise<Organization> {
    const doc = await OrganizationModel.create(data);
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<OrganizationWithAdmin | null> {
    const [doc] = await OrganizationModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
          deletedAt: null,
        },
      },

      // Find Organization Contact Person / Admin
      {
        $lookup: {
          from: 'users',
          let: { organizationId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$organizationId', '$$organizationId'] },
              },
            },
            {
              $lookup: {
                from: 'roles',
                localField: 'roleId',
                foreignField: '_id',
                as: 'role',
              },
            },
            { $unwind: { path: '$role', preserveNullAndEmptyArrays: false } },
            {
              $match: {
                'role.name': { $regex: '^org\\s*admin$', $options: 'i' },
              },
            },
            {
              $match: {
                $or: [
                  { status: { $in: ['active', 'invited'] } },
                  { status: { $exists: false } },
                ],
                deletedAt: null,
              },
            },
            {
              $project: {
                _id: 1, firstName: 1, lastName: 1, email: 1, phone: 1, status: 1,
              },
            },
            { $limit: 1 },
          ],
          as: 'admin',
        },
      },
      { $unwind: { path: '$admin', preserveNullAndEmptyArrays: true } },

      // Subscription Plan
      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'currentPlanId',
          foreignField: '_id',
          as: 'plan',
        },
      },
      { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1, name: 1, businessEmail: 1, businessPhone: 1, address: 1, status: 1,
          currentPlanId: 1, currentPlanName: '$plan.title', salesmanId: 1,
          documents: 1, deletedAt: 1, createdAt: 1, updatedAt: 1,
          admin: {
            id: '$admin._id', firstName: '$admin.firstName', lastName: '$admin.lastName',
            email: '$admin.email', phone: '$admin.phone', status: '$admin.status',
          },
        },
      },
    ]);

    if (!doc) return null;

    return {
      id: doc._id.toString(),
      name: doc.name,
      businessEmail: doc.businessEmail,
      businessPhone: doc.businessPhone,
      address: doc.address,
      status: doc.status,
      currentPlanId: doc.currentPlanId?.toString() ?? null,
      currentPlanName: doc.currentPlanName ?? null,
      salesmanId: doc.salesmanId?.toString() ?? null,
      deletedAt: doc.deletedAt ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      admin: doc.admin?.id
        ? {
          id: doc.admin.id.toString(),
          firstName: doc.admin.firstName ?? '',
          lastName: doc.admin.lastName ?? '',
          email: doc.admin.email ?? '',
          phone: doc.admin.phone ?? null,
        }
        : null,
    };
  }

  async findByBusinessEmail(email: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findOne({
      businessEmail: email.toLowerCase().trim(),
      deletedAt: null,
    });
    return doc ? this.toDomain(doc) : null;
  }

  async update(id: string, data: Partial<NewOrganization>): Promise<Organization | null> {
    const doc = await OrganizationModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      data,
      { new: true },
    );
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await OrganizationModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
    );
    return result !== null;
  }

  async list(filters: OrganizationListFilters = {}): Promise<OrganizationListResult> {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.min(Math.max(filters.limit ?? 10, 1), 100);
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = { deletedAt: null };

    if (filters.status) match.status = filters.status;
    if (filters.planId) match.currentPlanId = filters.planId;
    if (filters.salesmanId) match.salesmanId = filters.salesmanId;

    const [result] = await OrganizationModel.aggregate([
      { $match: match },

      {
        $lookup: {
          from: 'users',
          let: { organizationId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$organizationId', '$$organizationId'] },
                deletedAt: null,
              },
            },
            {
              $lookup: {
                from: 'roles',
                localField: 'roleId',
                foreignField: '_id',
                as: 'role',
              },
            },
            { $unwind: { path: '$role', preserveNullAndEmptyArrays: true } },
            {
              // relaxed: matches "org admin", "orgadmin", "Organization Admin", "Admin" etc.
              $match: {
                'role.name': { $regex: 'admin', $options: 'i' },
              },
            },
            { $sort: { createdAt: 1 } }, // pick earliest-created admin deterministically
            {
              $project: {
                _id: 1, firstName: 1, lastName: 1, email: 1, phone: 1, status: 1,
              },
            },
            { $limit: 1 },
          ],
          as: 'admin',
        },
      },
      { $unwind: { path: '$admin', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'currentPlanId',
          foreignField: '_id',
          as: 'plan',
        },
      },
      { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },

      ...(filters.search
        ? [
            {
              $match: {
                $or: [
                  { name: { $regex: filters.search, $options: 'i' } },
                  { businessEmail: { $regex: filters.search, $options: 'i' } },
                  { 'admin.email': { $regex: filters.search, $options: 'i' } },
                  { 'plan.title': { $regex: filters.search, $options: 'i' } },
                ],
              },
            },
          ]
        : []),

      { $sort: { createdAt: -1 } },

      {
        $facet: {
          items: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1, name: 1, businessEmail: 1, businessPhone: 1, address: 1, status: 1,
                currentPlanId: 1, currentPlanName: '$plan.title', salesmanId: 1,
                documents: 1, deletedAt: 1, createdAt: 1, updatedAt: 1,
                admin: {
                  id: '$admin._id', firstName: '$admin.firstName', lastName: '$admin.lastName',
                  email: '$admin.email', phone: '$admin.phone',
                },
              },
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const total = result?.total?.[0]?.count ?? 0;

    const items: OrganizationWithAdmin[] = (result?.items ?? []).map((doc: any) => ({
      id: doc._id.toString(),
      name: doc.name,
      businessEmail: doc.businessEmail,
      businessPhone: doc.businessPhone,
      address: doc.address,
      status: doc.status,
      currentPlanId: doc.currentPlanId ? doc.currentPlanId.toString() : null,
      currentPlanName: doc.currentPlanName ?? null,
      salesmanId: doc.salesmanId ? doc.salesmanId.toString() : null,
      documents: doc.documents ?? null,
      deletedAt: doc.deletedAt ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      admin: doc.admin?.id
        ? {
          id: doc.admin.id.toString(),
          firstName: doc.admin.firstName ?? '',
          lastName: doc.admin.lastName ?? '',
          email: doc.admin.email ?? null,
          phone: doc.admin.phone ?? null,
        }
        : null,
    }));

    return {
      items,
      meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
}

  async block(id: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { status: 'blocked' },
      { new: true },
    );
    return doc ? this.toDomain(doc) : null;
  }

  async unblock(id: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { status: 'active' },
      { new: true },
    );
    return doc ? this.toDomain(doc) : null;
  }

  async assignSalesman(id: string, salesmanId: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { salesmanId },
      { new: true },
    );
    return doc ? this.toDomain(doc) : null;
  }

  async changePlan(id: string, currentPlanId: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { currentPlanId },
      { new: true },
    );
    return doc ? this.toDomain(doc) : null;
  }

  private toDomain(doc: OrganizationDocument): Organization {
    return {
      id: doc._id.toString(),
      name: doc.name,
      businessEmail: doc.businessEmail,
      businessPhone: doc.businessPhone,
      address: doc.address,
      status: doc.status,
      currentPlanId: doc.currentPlanId?.toString() ?? null,
      salesmanId: doc.salesmanId?.toString() ?? null,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}