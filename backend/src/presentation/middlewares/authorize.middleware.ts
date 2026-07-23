import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { RolePermissionCache } from '../../infrastructure/cache/role-permission-cache';
import { UnauthorizedError, ForbiddenError } from '../../domain/errors/domain.error';

export function authorize(requiredPermission: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const cache = container.resolve<RolePermissionCache>(TOKENS.RolePermissionCache);
    const roleRepo = container.resolve<IRoleRepository>(TOKENS.RoleRepository);

    let hasActiveRole = false;
    for (const roleId of req.user.roleIds) {
      let role = cache.get(roleId);
      if (!role) {
        const fetched = await roleRepo.findWithPermissions(roleId);
        if (!fetched) continue;
        cache.set(roleId, fetched);
        role = fetched;
      }

      if (role.status !== 'active') continue;
      hasActiveRole = true;

      if (role.permissions.includes('*') || role.permissions.includes(requiredPermission)) {
        return next();
      }
    }

    if (!hasActiveRole) {
      return next(new ForbiddenError('No active role assigned'));
    }

    return next(new ForbiddenError(`Missing required permission: ${requiredPermission}`));
  };
}