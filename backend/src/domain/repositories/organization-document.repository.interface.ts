import {
    OrganizationDocument,
    NewOrganizationDocument,
} from '../entities/organization-document.entity';

export interface IOrganizationDocumentRepository {
    // Save document metadata after successful S3 upload
    create(data: NewOrganizationDocument): Promise<OrganizationDocument>;

    // Get a single document by its ID
    findById(id: string): Promise<OrganizationDocument | null>;

    //  List all active documents of an organization
    listByOrganization(organizationId: string): Promise<OrganizationDocument[]>;

    // Soft delete document metadata
    delete(id: string): Promise<boolean>;
}