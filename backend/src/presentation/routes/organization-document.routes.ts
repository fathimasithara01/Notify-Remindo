// import { Router } from 'express';
// import multer from 'multer';
// import { container } from '../../infrastructure/di/container';
// import { TOKENS } from '../../infrastructure/di/tokens';
// import { OrganizationDocumentController } from '../controllers/organization-document.controller';
// import { authenticate } from '../middlewares/require-auth.middleware';
// import { authorize } from '../middlewares/authorize.middleware';
// import { asyncHandler } from '../../shared/utils/async-handler';
// import { PERMISSIONS } from '../../shared/constants/permissions.constant';

// const router = Router();
// const controller = container.resolve(TOKENS.OrganizationDocumentController);

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 10 * 1024 * 1024,
//   },
//   fileFilter: (_req, file, cb) => {
//     const allowedMimeTypes = [
//       'application/pdf',
//       'image/jpeg',
//       'image/png',
//       'image/webp',
//       'application/msword',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     ];

//     if (!allowedMimeTypes.includes(file.mimetype)) {
//       cb(new Error('Invalid file type. Allowed: PDF, JPG, PNG, WEBP, DOC and DOCX'));
//       return;
//     }

//     cb(null, true);
//   },
// });

// router.use(authenticate);

// router.post('/:id/documents', authorize(PERMISSIONS.ORG_UPDATE), upload.single('document'), asyncHandler(controller.upload));
// router.get('/:organizationId/documents', authorize(PERMISSIONS.ORG_VIEW), asyncHandler(controller.list));
// router.get('/:organizationId/documents/:documentId/download', authorize(PERMISSIONS.ORG_VIEW), asyncHandler(controller.download));
// router.delete('/:id/documents/:documentId', authorize(PERMISSIONS.ORG_UPDATE), asyncHandler(controller.delete));

// export default router;