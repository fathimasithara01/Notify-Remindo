import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../../shared/utils/api-error';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(new ApiError('Validation failed', result.error.flatten()));
    }

    req.body = result.data;
    next();
  };
}