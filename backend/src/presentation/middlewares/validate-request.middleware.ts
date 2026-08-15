import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../../shared/utils/api-error';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
        console.log('BODY:', req.body, 'TYPE:', typeof req.body);

    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(new ApiError('Validation failed', result.error.flatten()));
    }

    // Only overwrite what the schema actually validated — avoids wiping
    // req.params/req.query if a schema only defines `body`.
    if (result.data.body !== undefined) req.body = result.data.body;
    if (result.data.params !== undefined) req.params = result.data.params;
    if (result.data.query !== undefined) req.query = result.data.query;

    next();
  };
}