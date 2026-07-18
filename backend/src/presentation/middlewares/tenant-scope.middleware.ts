import { Request, Response, NextFunction } from 'express';

export function tenantScope(_req: Request, _res: Response, next: NextFunction): void {
  next();
}