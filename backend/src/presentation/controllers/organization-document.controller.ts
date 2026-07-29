import { OrganizationDocumentUseCase } from './../../application/organization/use-cases/organization-document.usecase.ts';
import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { ApiResponse } from '../../shared/utils/api-response';
import { TOKENS } from '../../infrastructure/di/tokens';

@injectable()
export class OrganizationDocumentController {
  constructor(
    @inject(TOKENS.OrganizationDocumentUseCase)
    private readonly documentUseCase: OrganizationDocumentUseCase,
  ) { }

  /**
   * Upload organization document
   *
   * POST /organizations/:organizationId/documents
   */
  upload = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      ApiResponse.success(res, 'Unauthorized', 401);
      return;
    }

    const { organizationId } = req.params;

    const file = req.file;

    if (!file) {
      ApiResponse.success(res, 'Document file is required', 400);
      return;
    }

    const document = await this.documentUseCase.upload({
      organizationId,
      uploadedBy: req.user.userId,
      file: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    });

    ApiResponse.success(res, document, 201,'Document uploaded successfully');
  };
  /**
   * List organization documents
   *
   * GET /organizations/:organizationId/documents
   */
  list = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { organizationId } = req.params;

    const documents =
      await this.documentUseCase.listByOrganization(
        organizationId,
      );

    ApiResponse.success(
      res,
      documents,
    );
  };

  /**
   * Get secure download URL
   *
   * GET /organizations/:organizationId/documents/:documentId/download
   */
  download = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { documentId } = req.params;

    const downloadUrl =
      await this.documentUseCase.getDownloadUrl(
        documentId,
      );

    ApiResponse.success(
      res,
      {
        downloadUrl,
      },
    );
  };

  /**
   * Delete organization document
   *
   * DELETE /organizations/:organizationId/documents/:documentId
   */
  delete = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { documentId } = req.params;

    await this.documentUseCase.delete(
      documentId,
    );

    ApiResponse.success(
      res,
      null,
      200,
      'Document deleted successfully',
    );
  };
}