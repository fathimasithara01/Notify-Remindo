// import { Router } from 'express';
// import { container } from '../../infrastructure/di/container';
// import { TOKENS } from '../../infrastructure/di/tokens';
// import { UserController } from '../controllers/user.controller';
// import { authenticate } from '../middlewares/require-auth.middleware';
// import { authorize } from '../middlewares/authorize.middleware';
// import { validateRequest } from '../middlewares/validate-request.middleware';
// import {  editUserSchema, assignRoleSchema } from '../validators/platfromUser.validator';
// import { asyncHandler } from '../../shared/utils/async-handler';
// import { PERMISSIONS } from '../../shared/constants/permissions.constant';

// const router = Router();
// const controller = container.resolve<UserController>(TOKENS.UserController);

// router.use(authenticate);

// router.post('/', authorize(PERMISSIONS.USER_CREATE),  asyncHandler(controller.create));
// router.get('/', authorize(PERMISSIONS.USER_VIEW), asyncHandler(controller.list));
// router.get('/:id', authorize(PERMISSIONS.USER_VIEW), asyncHandler(controller.getOne));
// router.patch('/:id', authorize(PERMISSIONS.USER_UPDATE), validateRequest(editUserSchema), asyncHandler(controller.update));
// router.delete('/:id', authorize(PERMISSIONS.USER_DELETE), asyncHandler(controller.delete));

// router.post('/:id/revoke-sessions', authorize(PERMISSIONS.USER_UPDATE), asyncHandler(controller.revokeSessions));
// // router.post('/:id/block', authorize(PERMISSIONS.USER_UPDATE), asyncHandler(controller.block));
// // router.post('/:id/unblock', authorize(PERMISSIONS.USER_UPDATE), asyncHandler(controller.unblock));
// // router.get('/:id/roles', authorize(PERMISSIONS.USER_VIEW), asyncHandler(controller.getRoles));
// // router.post('/:id/roles', authorize(PERMISSIONS.ROLE_ASSIGN), validateRequest(assignRoleSchema), asyncHandler(controller.assignRole));
// // router.delete('/:id/roles/:roleId', authorize(PERMISSIONS.ROLE_ASSIGN), asyncHandler(controller.removeRole));

// export default router;