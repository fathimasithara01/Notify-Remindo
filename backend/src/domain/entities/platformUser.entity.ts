export type PlatformUserStatus = 'invited' | 'active' | 'inactive' | 'suspended';

export interface PlatformUser {
  id: string;
  passwordHash: string | null;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  phone?: string;
  status: PlatformUserStatus;
  tokenVersion: number;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type NewPlatformUser = Omit<PlatformUser, 'id' | 'createdAt' | 'updatedAt' | 'tokenVersion'> & {
  tokenVersion?: number;
};