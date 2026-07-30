import { inject, injectable } from 'tsyringe';

import {
  IOrganizationDocumentRepository,
} from '../../../domain/repositories/organization-document.repository.interface';

import {
  IFileStorageService,
} from '../../../domain/services/file-storage.service.interface';



import {
  OrganizationDocument,
} from '../../../domain/entities/organization-document.entity';

import { TOKENS } from '../../../infrastructure/di/tokens';

export interface UploadOrganizationDocumentInput {
  organizationId: string;
  uploadedBy: string;

  file: Buffer;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

@injectable()
export class OrganizationDocumentUseCase {
  constructor(
    @inject(TOKENS.OrganizationDocumentRepository)
    private readonly documentRepository: IOrganizationDocumentRepository,

    @inject(TOKENS.FileStorageService)
    private readonly fileStorageService: IFileStorageService,
  ) { }

  /**
   * Upload organization document
   *
   * 1. Upload actual file to S3
   * 2. Save S3 metadata in MongoDB
   */
  async upload(input: UploadOrganizationDocumentInput): Promise<OrganizationDocument> {
    const uploadedFile = await this.fileStorageService.upload(
      input.file,
      input.fileName,
      input.mimeType,
      `organizations/${input.organizationId}/documents`,
    );

    try {
      const document = await this.documentRepository.create({
        organizationId: input.organizationId,
        fileName: input.fileName,
        fileUrl: uploadedFile.fileUrl,
        fileKey: uploadedFile.fileKey,
        mimeType: input.mimeType,
        fileSize: input.fileSize,
        uploadedBy: input.uploadedBy,
      });

      return document;
  
    } catch (error) {
      // If MongoDB save fails after S3 upload,
      // remove the orphan file from S3.
      await this.fileStorageService.delete(
        uploadedFile.fileKey,
      );

      throw error;
    }
  }

  /**
   * Get all documents belonging to an organization
   */
  async listByOrganization(
    organizationId: string
  ): Promise<OrganizationDocument[]> {
    return this.documentRepository.listByOrganization(
      organizationId,
    );
  }

  /**
   * Generate a temporary secure download URL
   */
  async getDownloadUrl(
    documentId: string
  ): Promise<string> {
    const document =
      await this.documentRepository.findById(
        documentId,
      );

    if (!document) {
      throw new Error(
        'Organization document not found',
      );
    }

    return this.fileStorageService.getDownloadUrl(
      document.fileKey,
    );
  }

  /**
   * Delete organization document
   *
   * 1. Soft delete MongoDB metadata
   * 2. Delete actual file from S3
   */
  async delete(
    documentId: string
  ): Promise<void> {
    const document =
      await this.documentRepository.findById(
        documentId,
      );

    if (!document) {
      throw new Error(
        'Organization document not found',
      );
    }

    const deleted =
      await this.documentRepository.delete(
        documentId,
      );

    if (!deleted) {
      throw new Error(
        'Failed to delete organization document',
      );
    }

    try {
      await this.fileStorageService.delete(
        document.fileKey,
      );
    } catch (error) {
      // MongoDB metadata is already soft-deleted.
      // Log this error for retry/cleanup.
      console.error(
        'Failed to delete document from S3:',
        error,
      );

      throw error;
    }
  }
}