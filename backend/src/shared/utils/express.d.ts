import {  } from '../../domain/services/token.service.interface';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roleId: string;
        organizationId?: string;
        tokenVersion: number;
      };
    }
  }
}