export interface CreateOrganizationDto {
  name: string;

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

  // Primary contact = initial Organization Admin
  admin: {
    name: string;
    email: string;
    phone?: string;
  };
}