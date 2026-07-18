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
    const doc = await OrganizationModel.findOne({ _id: id, deletedAt: null });
    return doc ? this.toDomain(doc) : null;
  }

  async update(id: string, data: Partial<NewOrganization>): Promise<Organization | null> {
    const doc = await OrganizationModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await OrganizationModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date(), status: 'blocked' }
    );
    return result !== null;
  }

  async list(filter?: {
    status?: 'active' | 'blocked';
    salesmanId?: string;
    planId?: string;
  }): Promise<Organization[]> {
    const query: Record<string, unknown> = { deletedAt: null };
    if (filter?.status) query.status = filter.status;
    if (filter?.salesmanId) query.salesmanId = filter.salesmanId;
    if (filter?.planId) query.currentPlanId = filter.planId;

    const docs = await OrganizationModel.find(query);
    return docs.map((doc) => this.toDomain(doc));
  }

  async block(id: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findByIdAndUpdate(id, { status: 'blocked' }, { new: true });
    return doc ? this.toDomain(doc) : null;
  }

  async unblock(id: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findByIdAndUpdate(id, { status: 'active' }, { new: true });
    return doc ? this.toDomain(doc) : null;
  }

  async assignSalesman(id: string, salesmanId: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findByIdAndUpdate(id, { salesmanId }, { new: true });
    return doc ? this.toDomain(doc) : null;
  }

  async changePlan(id: string, planId: string): Promise<Organization | null> {
    const doc = await OrganizationModel.findByIdAndUpdate(
      id,
      { currentPlanId: planId },
      { new: true }
    );
    return doc ? this.toDomain(doc) : null;
  }

  async addContactPerson(
    organizationId: string,
    data: NewContactPerson
  ): Promise<ContactPerson> {
    const doc = await ContactPersonModel.create({ ...data, organizationId });
    return this.contactToDomain(doc);
  }

  async listContactPersons(organizationId: string): Promise<ContactPerson[]> {
    const docs = await ContactPersonModel.find({ organizationId });
    return docs.map((doc) => this.contactToDomain(doc));
  }

  async removeContactPerson(contactPersonId: string): Promise<boolean> {
    const result = await ContactPersonModel.findByIdAndDelete(contactPersonId);
    return result !== null;
  }

  private toDomain(doc: OrganizationDocument): Organization {
    return {
      id: doc._id.toString(),
      name: doc.name,
      businessDetails: doc.businessDetails,
      contactEmail: doc.contactEmail,
      contactPhone: doc.contactPhone,
      address: doc.address,
      status: doc.status,
      currentPlanId: doc.currentPlanId.toString(),
      salesmanId: doc.salesmanId ? doc.salesmanId.toString() : null,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private contactToDomain(doc: ContactPersonDocument): ContactPerson {
    return {
      id: doc._id.toString(),
      organizationId: doc.organizationId.toString(),
      name: doc.name,
      designation: doc.designation,
      phone: doc.phone,
      email: doc.email,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}