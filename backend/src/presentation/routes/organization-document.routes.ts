import { Router } from 'express';
import multer from 'multer';

import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';

import { OrganizationDocumentController } from '../controllers/organization-document.controller';

import { requireAuth } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();

const controller = container.resolve<OrganizationDocumentController>(TOKENS.OrganizationDocumentController);

/**
 * Multer configuration
 *
 * Files are temporarily stored in memory
 * and then uploaded to S3 by the FileStorageService.
 */
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(
        new Error(
          'Invalid file type. Allowed: PDF, JPG, PNG, WEBP, DOC and DOCX'
        )
      );

      return;
    }

    cb(null, true);
  },
});


/**
 * All organization document routes require authentication.
 */
router.use(requireAuth);


/**
 * Upload organization document
 *
 * POST /organizations/:organizationId/documents
 */
router.post(
  '/organizations/:organizationId/documents',
  authorize('organization.edit'),
  upload.single('document'),
  asyncHandler(controller.upload)
);


/**
 * List organization documents
 *
 * GET /organizations/:organizationId/documents
 */
router.get(
  '/organizations/:organizationId/documents',
  authorize('organization.view'),
  asyncHandler(controller.list)
);


/**
 * Generate secure download URL
 *
 * GET /organizations/:organizationId/documents/:documentId/download
 */
router.get(
  '/organizations/:organizationId/documents/:documentId/download',
  authorize('organization.view'),
  asyncHandler(controller.download)
);


/**
 * Delete organization document
 *
 * DELETE /organizations/:organizationId/documents/:documentId
 */
router.delete(
  '/organizations/:organizationId/documents/:documentId',
  authorize('organization.edit'),
  asyncHandler(controller.delete)
);


export default router;