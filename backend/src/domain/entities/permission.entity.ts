export interface Permission {
  id: string;
  name: string; 
  module: string; 
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewPermission = Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>;