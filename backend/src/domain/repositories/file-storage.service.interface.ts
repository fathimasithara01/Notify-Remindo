export interface UploadedFile {
    fileUrl: string;
    fileKey: string;
}

export interface IFileStorageService {
    upload(
        file: Buffer,
        fileName: string,
        mimeType: string,
        folder: string
    ): Promise<UploadedFile>;

    delete(
        fileKey: string
    ): Promise<void>;

    getDownloadUrl(
        fileKey: string
    ): Promise<string>;
}