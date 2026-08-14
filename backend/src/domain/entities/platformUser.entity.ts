export type PlatformUserStatus =  'active' | 'inactive' ;

export interface PlatformUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string | null;
  roleId: string;
  phone?: string;
  status: PlatformUserStatus;
  tokenVersion: number;
  
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type NewPlatformUser = Omit<PlatformUser, 'id' | 'createdAt' | 'updatedAt' | 'tokenVersion'> & {
  tokenVersion?: number;
};