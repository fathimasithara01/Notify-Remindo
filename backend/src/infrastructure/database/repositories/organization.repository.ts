import { injectable } from 'tsyringe';
import { IOrganizationRepository, OrganizationListFilters, OrganizationListResult } from '../../../domain/repositories/organization.repository.interface';
import { Organization, NewOrganization, OrganizationWithAdmin, OrganizationDetails } from '../../../domain/entities/organization.entity';
import { OrganizationModel, OrganizationDocument } from '../models/organization.model';
import { Types } from 'mongoose';

@injectable()
export class OrganizationRepository implements IOrganizationRepository {

  async create(data: NewOrganization): Promise<Organization> {
    const doc = await OrganizationModel.create(data);
    return this.toDomain(doc);
  }

  // aggregate() use cheyyunnath complex data processing cheyyan aanu. Data group, count, sum, filter, sort etc. cheyyunnu.
  async findById(id: string): Promise<OrganizationDetails | null> {

    const [doc] = await OrganizationModel.aggregate([
      // 1. Find organization
      {
        $match: {
          _id: new Types.ObjectId(id),
          deletedAt: null,
        },
      },

      // 2. Find users belonging to this organization
      {
        $lookup: {
          from: 'users',
          let: {
            organizationId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    '$organizationId',
                    '$$organizationId',
                  ],
                },
              },
            },

            // 3. Find user's role mappings
            {
              $lookup: {
                from: 'userroles',
                localField: '_id',
                foreignField: 'userId',
                as: 'userRoleMappings',
              },
            },

            // 4. Find role details
            {
              $lookup: {
                from: 'roles',
                localField: 'userRoleMappings.roleId',
                foreignField: '_id',
                as: 'userRoles',
              },
            },

            // 5. Only Organization Admin
            {
              $match: {
                'userRoles.name': 'orgadmin',
              },
            },

            // 6. Active or invited admin
            {
              $match: {
                status: {
                  $in: ['active', 'invited'],
                },
                deletedAt: null,
              },
            },

            // 7. Only required fields
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                phone: 1,
                status: 1,
              },
            },

            // 8. Only one admin
            {
              $limit: 1,
            },
          ],
          as: 'admin',
        },
      },

      // 9. Convert admin array into object
      {
        $unwind: {
          path: '$admin',
          preserveNullAndEmptyArrays: true,
        },
      },

      // 10. Return required fields
      {
        $project: {
          _id: 1,
          name: 1,
          businessEmail: 1,
          businessPhone: 1,
          address: 1,
          status: 1,
          currentPlanId: 1,
          salesmanId: 1,
          documents: 1,
          deletedAt: 1,
          createdAt: 1,
          updatedAt: 1,

          admin: {
            id: '$admin._id',
            name: '$admin.name',
            email: '$admin.email',
            phone: '$admin.phone',
            status: '$admin.status',
          },
        },
      },
    ]);

    if (!doc) {
      return null;
    }

    return {
      id: doc._id.toString(),
      name: doc.name,
      businessEmail: doc.businessEmail,
      businessPhone: doc.businessPhone,
      address: doc.address,
      status: doc.status,
      currentPlanId: doc.currentPlanId?.toString() ?? null,
      salesmanId: doc.salesmanId?.toString() ?? null,
      documents: doc.documents ?? [],
      deletedAt: doc.deletedAt ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,

      admin: doc.admin?.id
        ? {
          id: doc.admin.id.toString(),
          name: doc.admin.name,
          email: doc.admin.email,
          phone: doc.admin.phone ?? null,
          status: doc.admin.status,
        }
        : null,
    };
  }

  async update(id: string, data: Partial<NewOrganization>): Promise<Organization | null> {
    const doc = await OrganizationModel.findOneAndUpdate(
      {
        _id: id,
        deletedAt: null,
      },
      data,
      {
        new: true,
      }
    );

    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await OrganizationModel.findOneAndUpdate(
      {
        _id: id,
        deletedAt: null,
      },
      {
        deletedAt: new Date(),
      }
    );

    return result !== null;
  }

  async list(
    filters: OrganizationListFilters = {},
  ): Promise<OrganizationListResult> {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.min(Math.max(filters.limit ?? 10, 1), 100);
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = {
      deletedAt: null,
    };

    if (filters.status) match.status = filters.status;

    if (filters.planId) {
      match.currentPlanId = filters.planId;
    }

    if (filters.salesmanId) {
      match.salesmanId = filters.salesmanId;
    }

    if (filters.search) {
      match.name = {
        $regex: filters.search,
        $options: 'i',
      };
    }

    const [result] = await OrganizationModel.aggregate([
      {
        $match: match,
      },

      // Find Organization Admin
      {
        $lookup: {
          from: 'users',
          let: {
            organizationId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$organizationId', '$$organizationId'],
                },
              },
            },

            // User -> Role
            {
              $lookup: {
                from: 'roles',
                localField: 'roleId',
                foreignField: '_id',
                as: 'role',
              },
            },

            {
              $unwind: {
                path: '$role',
                preserveNullAndEmptyArrays: false,
              },
            },

            {
              $match: {
                'role.name': { $regex: '^org\\s*admin$', $options: 'i' },

              },
            },

            // Active / invited admin only
            {
              $match: {
                status: {
                  $in: ['active', 'invited'],
                },
              },
            },

            // Admin fields
            {
              $project: {
                _id: 1,
                name: {
                  $trim: {
                    input: { $concat: ['$firstName', ' ', '$lastName'] },
                  },
                },
                email: 1,
                status: 1,

              },
            },

            {
              $limit: 1,
            },
          ],
          as: 'admin',
        },
      },

      {
        $unwind: {
          path: '$admin',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Subscription Plan
      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'currentPlanId',
          foreignField: '_id',
          as: 'plan',
        },
      },

      {
        $unwind: {
          path: '$plan',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Latest first
      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $facet: {
          items: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },

            {
              $project: {
                _id: 1,
                name: 1,
                businessEmail: 1,
                businessPhone: 1,
                address: 1,
                status: 1,

                currentPlanId: 1,
                currentPlanName: '$plan.name',

                salesmanId: 1,

                documents: 1,
                deletedAt: 1,
                createdAt: 1,
                updatedAt: 1,

                // Admin
                admin: {
                  id: '$admin._id',
                  name: '$admin.name',
                  email: '$admin.email',
                  status: '$admin.status',
                  // phone: '$admin.phone',  -- field ഇല്ലാത്തതിനാൽ ഒഴിവാക്കി
                },
              },
            },
          ],

          total: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);



    const total = result?.total?.[0]?.count ?? 0;

    const items: OrganizationWithAdmin[] = (result?.items ?? []).map(
      (doc: any) => ({
        id: doc._id.toString(),
        name: doc.name,
        businessEmail: doc.businessEmail,
        businessPhone: doc.businessPhone,
        address: doc.address,
        status: doc.status,

        currentPlanId: doc.currentPlanId?.toString() ?? null,
        currentPlanName: doc.currentPlanName ?? null,

        salesmanId: doc.salesmanId?.toString() ?? null,

        documents: doc.documents ?? null,
        deletedAt: doc.deletedAt ?? null,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,

        admin: doc.admin?.id
          ? {
            id: doc.admin.id.toString(),
            name: doc.admin.name ?? null,
            email: doc.admin.email ?? null,
            status: doc.admin.status ?? null,
          }
          : null,
      }),
    );

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }
  async block(id: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findOneAndUpdate(
      {
        _id: id,
        deletedAt: null,
      },
      {
        status: 'blocked',
      },
      {
        new: true,
      }
    );

    return doc ? this.toDomain(doc) : null;
  }

  async unblock(id: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findOneAndUpdate(
      {
        _id: id,
        deletedAt: null,
      },
      {
        status: 'active',
      },
      {
        new: true,
      }
    );

    return doc ? this.toDomain(doc) : null;
  }

  async assignSalesman(id: string, salesmanId: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findOneAndUpdate(
      {
        _id: id,
        deletedAt: null,
      },
      {
        salesmanId,
      },
      {
        new: true,
      }
    );

    return doc ? this.toDomain(doc) : null;
  }

  async changePlan(id: string, currentPlanId: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findOneAndUpdate(
      {
        _id: id,
        deletedAt: null,
      },
      {
        currentPlanId,
      },
      {
        new: true,
      }
    );

    return doc ? this.toDomain(doc) : null;
  }

  // async addContactPerson(organizationId: string, data: NewContactPerson): Promise<ContactPerson> {
  //   const doc = await ContactPersonModel.create({
  //     ...data, // without spread they give nested data
  //     organizationId,
  //   });

  //   return this.contactToDomain(doc);
  // }

  // async listContactPersons(organizationId: string): Promise<ContactPerson[]> {
  //   const docs = await ContactPersonModel.find({
  //     organizationId,
  //   });

  //   return docs.map((doc) => this.contactToDomain(doc));
  // }

  // async getContactPerson(organizationId: string, contactPersonId: string): Promise<ContactPerson | null> {
  //   const doc = await ContactPersonModel.findOne({
  //     _id: contactPersonId,
  //     organizationId,
  //   });

  //   return doc ? this.contactToDomain(doc) : null;
  // }

  // async updateContactPerson(organizationId: string, contactPersonId: string, data: Partial<NewContactPerson>): Promise<ContactPerson | null> {
  //   const doc = await ContactPersonModel.findOneAndUpdate(
  //     {
  //       _id: contactPersonId,
  //       organizationId,
  //     },
  //     data,
  //     {
  //       new: true,
  //     }
  //   );

  //   return doc ? this.contactToDomain(doc) : null;
  // }

  // async removeContactPerson(organizationId: string, contactPersonId: string): Promise<boolean> {
  //   const result = await ContactPersonModel.findOneAndDelete({
  //     _id: contactPersonId,
  //     organizationId,
  //   });

  //   return result !== null;
  // }

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