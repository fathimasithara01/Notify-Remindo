import { injectable } from 'tsyringe';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { Organization, NewOrganization } from '../../../domain/entities/organization.entity';
import { ContactPerson, NewContactPerson } from '../../../domain/entities/contact-person.entity';
import { OrganizationModel, OrganizationDocument } from '../models/organization.model';
import { ContactPersonModel, ContactPersonDocument } from '../models/contact-person.model';

@injectable()
export class OrganizationRepository implements IOrganizationRepository {

  async create(data: NewOrganization): Promise<Organization> {
    const doc = await OrganizationModel.create(data);
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findOne({
      _id: id,
      deletedAt: null,
    });

    return doc ? this.toDomain(doc) : null;
  }

  async update(
    id: string,
    data: Partial<NewOrganization>
  ): Promise<Organization | null> {
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

  async list(filter?: {
    status?: 'active' | 'blocked';
    salesmanId?: string;
    planId?: string;
    search?: string;
  }): Promise<Organization[]> {

    const query: Record<string, unknown> = { deletedAt: null };

    if (filter?.status) {
      query.status = filter.status;
    }

    if (filter?.salesmanId) {
      query.salesmanId = filter.salesmanId;
    }

    if (filter?.planId) {
      query.currentPlanId = filter.planId;
    }

    if (filter?.search) {
      const regex = new RegExp(filter.search.trim(), 'i');

      query.$or = [
        { name: regex },
        { businessEmail: regex },
        { businessPhone: regex },
      ];
    }

    const docs = await OrganizationModel.find(query);

    return docs.map((doc) => this.toDomain(doc));
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

  async addContactPerson(organizationId: string, data: NewContactPerson): Promise<ContactPerson> {
    const doc = await ContactPersonModel.create({
      ...data, // without spread they give nested data
      organizationId,
    });

    return this.contactToDomain(doc);
  }

  async listContactPersons(organizationId: string): Promise<ContactPerson[]> {
    const docs = await ContactPersonModel.find({
      organizationId,
    });

    return docs.map((doc) => this.contactToDomain(doc));
  }

  async getContactPerson(organizationId: string, contactPersonId: string): Promise<ContactPerson | null> {
    const doc = await ContactPersonModel.findOne({
      _id: contactPersonId,
      organizationId,
    });

    return doc ? this.contactToDomain(doc) : null;
  }

  async updateContactPerson(organizationId: string, contactPersonId: string, data: Partial<NewContactPerson>): Promise<ContactPerson | null> {
    const doc = await ContactPersonModel.findOneAndUpdate(
      {
        _id: contactPersonId,
        organizationId,
      },
      data,
      {
        new: true,
      }
    );

    return doc ? this.contactToDomain(doc) : null;
  }

  async removeContactPerson(organizationId: string, contactPersonId: string): Promise<boolean> {
    const result = await ContactPersonModel.findOneAndDelete({
      _id: contactPersonId,
      organizationId,
    });

    return result !== null;
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

  private contactToDomain(
    doc: ContactPersonDocument
  ): ContactPerson {
    return {
      id: doc._id.toString(),
      organizationId: doc.organizationId.toString(),
      name: doc.name,
      designation: doc.designation,
      contactEmail: doc.phone,
      contactPhone: doc.email,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}