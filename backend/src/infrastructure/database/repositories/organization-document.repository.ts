import { injectable } from 'tsyringe';
import {
    IOrganizationDocumentRepository,
} from '../../../domain/repositories/organization-document.repository.interface';

import {
    OrganizationDocument,
    NewOrganizationDocument,
} from '../../../domain/entities/organization-document.entity';

import {
    OrganizationDocumentModel,
    OrganizationDocumentDocument,
} from '../models/organization-document.model';

@injectable()
export class OrganizationDocumentRepository
    implements IOrganizationDocumentRepository {

    async create(data: NewOrganizationDocument): Promise<OrganizationDocument> {
        const doc = await OrganizationDocumentModel.create({
            ...data,
            organizationId: data.organizationId,
            uploadedBy: data.uploadedBy,
        });

        return this.toDomain(doc);
    }

    async findById(id: string): Promise<OrganizationDocument | null> {
        const doc = await OrganizationDocumentModel.findOne({
            _id: id,
            deletedAt: null,
        });

        return doc ? this.toDomain(doc) : null;
    }

    async listByOrganization(organizationId: string): Promise<OrganizationDocument[]> {
        const docs = await OrganizationDocumentModel.find({
            organizationId,
            deletedAt: null,
        }).sort({
            createdAt: -1,
        });

        return docs.map((doc) => this.toDomain(doc));
    }

    async delete(id: string): Promise<boolean> {
        const result =
            await OrganizationDocumentModel.findOneAndUpdate(
                {
                    _id: id,
                    deletedAt: null,
                },
                {
                    deletedAt: new Date(),
                },
                {
                    new: true,
                }
            );

        return result !== null;
    }

    private toDomain(doc: OrganizationDocumentDocument): OrganizationDocument {
        return {
            id: doc._id.toString(),
            organizationId: doc.organizationId.toString(),
            fileName: doc.fileName,
            fileUrl: doc.fileUrl,
            fileKey: doc.fileKey,
            mimeType: doc.mimeType,
            fileSize: doc.fileSize,
            uploadedBy: doc.uploadedBy.toString(),
            uploadedAt: doc.uploadedAt,
            updatedAt: doc.updatedAt,
            deletedAt: doc.deletedAt ?? null,
        };
    }
}