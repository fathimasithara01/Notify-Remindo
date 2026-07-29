export interface OrganizationDocument {
    id: string;

    organizationId: string;

    fileName: string;
    fileUrl: string;
    fileKey: string;

    mimeType: string;
    fileSize: number;

    uploadedBy: string;

    uploadedAt: Date;
    updatedAt: Date;

    deletedAt: Date | null;
}

export interface NewOrganizationDocument {
    organizationId: string;

    fileName: string;
    fileUrl: string;
    fileKey: string;

    mimeType: string;
    fileSize: number;

    uploadedBy: string;
}