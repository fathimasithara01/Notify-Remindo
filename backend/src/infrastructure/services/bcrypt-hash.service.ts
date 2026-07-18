import bcrypt from 'bcryptjs';
import { IHashService } from '../../domain/services/hash.service.interface';

const SALT_ROUNDS = 10;

export class BcryptHashService implements IHashService {
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}