export interface CreateOrganizationDto {
  name: string;

  businessEmail: string;
  businessPhone: string;
  address?: string;

  planId: string;
  salesmanId?: string;

  documents?: {
    fileName: string;
    fileUrl: string;
    fileKey: string;
    mimeType: string;
    fileSize: number;
    uploadedAt: Date;
  }[];

  contactPerson: {
    name: string;
    designation?: string;
    phone?: string;
    email?: string;
  };

  admin: {
    name: string;
    email: string;
  };
}