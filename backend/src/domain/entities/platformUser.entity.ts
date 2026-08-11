export type PlatformUserStatus = 'active' | 'inactive' | 'suspended';

export interface PlatformUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  roleId: string;
  status: PlatformUserStatus;
  mustChangePassword: boolean;
  tokenVersion: number;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type NewPlatformUser = Omit<PlatformUser, 'id' | 'createdAt' | 'updatedAt' | 'tokenVersion'> & {
  tokenVersion?: number;
};