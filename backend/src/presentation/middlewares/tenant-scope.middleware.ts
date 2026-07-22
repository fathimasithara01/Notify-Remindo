import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../domain/errors/domain.error';

declare global {
  namespace Express {
    interface Request {
      tenantOrganizationId?: string;
    }
  }
}

/**
 * Enforces multi-tenancy for Org Admin panel routes. Requires requireAuth to
 * have run first (reads req.user). Internal Super Admin/Support users have
 * no organizationId and are rejected here — they use the separate
 * Super Admin routes (/api/organizations/*), which operate across all
 * organizations by design and don't go through this middleware.
 *
 * Usage in future Org Admin controllers/repositories:
 *   const clients = await clientRepo.list({ organizationId: req.tenantOrganizationId });
 */
export function tenantScope(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user?.organizationId) {
    return next(
      new ForbiddenError('This resource is only available to organization-scoped accounts')
    );
  }

  req.tenantOrganizationId = req.user.organizationId;
  next();
}