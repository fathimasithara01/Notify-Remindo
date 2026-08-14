import { Schema, model, Document, Types } from 'mongoose';
import { PlatformUserStatus } from '../../../domain/entities/platformUser.entity';

export interface PlatformUserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string | null;

    roleId: Types.ObjectId;
    phone: string;
    status: PlatformUserStatus;
    tokenVersion: number;

    resetPasswordToken?: string;
    // resetPasswordTokenExpiresAt?: Date;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const platformUserSchema = new Schema<PlatformUserDocument>(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },

        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, default: null },

        roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true, index: true },
        phone: { type: String, default: null },
        status: {
            type: String,
            enum: ['invited', 'active', 'inactive', 'suspended'],
            default: 'invited',
            index: true,
        },
        tokenVersion: { type: Number, default: 0 },
        resetPasswordToken: { type: String, index: true },
        // resetPasswordTokenExpiresAt: { type: Date },
        lastLoginAt: { type: Date },
    },
    { timestamps: true }
);

export const PlatformUserModel = model<PlatformUserDocument>('PlatformUser', platformUserSchema);