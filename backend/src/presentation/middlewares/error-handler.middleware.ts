import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../shared/utils/api-error';
import { DomainError } from '../../domain/errors/domain.error';
import { env } from '../../config/env';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
    return;
  }

  if (err instanceof DomainError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern || {})[0] || 'field';
    res.status(409).json({
      success: false,
      message: `This ${field} is already in use. Please use a different one.`,
    });
    return;
  }


  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}