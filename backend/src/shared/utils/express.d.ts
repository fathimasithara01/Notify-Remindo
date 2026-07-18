import { TokenPayload } from '../../domain/services/token.service.interface';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};