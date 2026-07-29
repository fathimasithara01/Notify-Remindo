import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { injectable } from 'tsyringe';

import {
    IFileStorageService,
    UploadedFile,
} from '../../domain/services/file-storage.service.interface';

@injectable()
export class S3FileStorageService implements IFileStorageService {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });

        this.bucketName = process.env.AWS_S3_BUCKET_NAME!;
    }

    async upload(
        file: Buffer,
        fileName: string,
        mimeType: string,
        folder: string
    ): Promise<UploadedFile> {
        const fileKey = `${folder}/${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
            Body: file,
            ContentType: mimeType,
        });

        await this.s3Client.send(command);

        return {
            fileKey,
            fileUrl: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
        };
    }

    async delete(
        fileKey: string
    ): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
        });

        await this.s3Client.send(command);
    }

    async getDownloadUrl(
        fileKey: string
    ): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
        });

        return getSignedUrl(
            this.s3Client,
            command,
            {
                expiresIn: 300, // 5 minutes
            }
        );
    }
}