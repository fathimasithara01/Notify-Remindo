export interface ContactPerson {
  id: string;
  organizationId: string;
  name: string;
  designation?: string;
  contactPhone?: string;
  contactEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewContactPerson = Omit<ContactPerson, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>;