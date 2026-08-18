// export type UserStatus =  'active' | 'inactive' ;

export interface User {
    id: string;
    organizationId: string;
    email: string;
    passwordHash: string | null;
    firstName: string;
    lastName: string;
    roleId: string;
    phone: string,
    
    lastLoginAt?: Date;
    resetPasswordToken?: string;
    resetPasswordTokenExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'tokenVersion'> & {
    tokenVersion?: number;
};