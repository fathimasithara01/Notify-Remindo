export type UserStatus = 'invited' | 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null;
  roleId: string;
  status: UserStatus;
  organizationId?: string | null; 
  inviteToken?: string | null;
  inviteTokenExpiresAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;