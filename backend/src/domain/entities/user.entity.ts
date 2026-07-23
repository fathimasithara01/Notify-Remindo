export type UserStatus = 'invited' | 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null;
  status: UserStatus;
  organizationId?: string | null; 
  inviteToken?: string | null;
  inviteTokenExpiresAt?: Date | null;
  tokenVersion: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;