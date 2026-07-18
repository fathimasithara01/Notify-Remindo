import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { UnauthorizedError, ForbiddenError } from '../../domain/errors/domain.error';

export function authorize(requiredPermission: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const roleRepo = container.resolve<IRoleRepository>(TOKENS.RoleRepository);
    const role = await roleRepo.findWithPermissions(req.user.roleId);

    if (!role || role.status !== 'active') {
      return next(new ForbiddenError('Role is not active'));
    }

    const hasPermission = role.permissions.includes('*') || role.permissions.includes(requiredPermission);

    if (!hasPermission) {
      return next(new ForbiddenError(`Missing required permission: ${requiredPermission}`));
    }

    next();
  };
}