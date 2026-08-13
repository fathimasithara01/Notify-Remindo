export type OrganizationInviteMethod = 'email' | 'temppassword';

export interface CreateOrganizationDto {
  name: string

  businessEmail: string;
  businessPhone: string;
  address: string;

  planId?: string;
  salesmanId?: string;

  documents?: {
    fileName: string;
    fileUrl: string;
    fileKey: string;
    mimeType: string;
    fileSize: number;
    uploadedAt: Date;
  }[];

  inviteMethod: OrganizationInviteMethod;

  admin: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
}