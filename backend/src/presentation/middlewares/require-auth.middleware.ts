import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IPermissionResolver } from '../../domain/services/IPermissionResolver';
import { Permission } from '../../shared/constants/permissions.constant';
import { UnauthorizedError, ForbiddenError } from '../../domain/errors/domain.error';

export function requirePermission(...requiredPermissions: Permission[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.roleId) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const resolver = container.resolve<IPermissionResolver>(TOKENS.PermissionResolver);
      const permissions = await resolver.resolve(req.user.roleId);

      const hasAccess =
        permissions.has('*' as Permission) ||
        requiredPermissions.every((p) => permissions.has(p));

      if (!hasAccess) {
        return next(new ForbiddenError(`Missing required permission: ${requiredPermissions.join(', ')}`));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}