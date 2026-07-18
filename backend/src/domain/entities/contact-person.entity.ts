export interface ContactPerson {
  id: string;
  organizationId: string;
  name: string;
  designation?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewContactPerson = Omit<ContactPerson, 'id' | 'createdAt' | 'updatedAt'>;