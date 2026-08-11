import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { IPermissionResolver } from '../../domain/services/IPermissionResolver';
import { Permission } from '../../shared/constants/permissions.constant';

// Assumes an earlier auth middleware has already set req.user with { id, roleId, ... }
export function requirePermission(...requiredPermissions: Permission[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as { id: string; roleId: string } | undefined;

      if (!user?.roleId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const resolver = container.resolve<IPermissionResolver>('IPermissionResolver');
      const permissions = await resolver.resolve(user.roleId);

      const hasAll = requiredPermissions.every((p) => permissions.has(p));

      if (!hasAll) {
        return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}