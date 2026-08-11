export type PlatformUserStatus = 'invited' | 'active' | 'inactive' | 'suspended';

export interface PlatformUser {
  id: string;
  email: string;
  passwordHash: string | null;
  firstName: string;
  lastName: string;
  roleId: string;
  status: PlatformUserStatus;
  mustChangePassword: boolean;
  tokenVersion: number;
  inviteToken?: string;
  inviteTokenExpiresAt?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type NewPlatformUser = Omit<PlatformUser, 'id' | 'createdAt' | 'updatedAt' | 'tokenVersion'> & {
  tokenVersion?: number;
};