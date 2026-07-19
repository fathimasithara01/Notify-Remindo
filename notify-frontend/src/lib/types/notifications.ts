export type NotificationReferenceType = 'PDC_ISSUED' | 'PDC_RECEIVED' | 'HR_DOC';
export type NotificationMode = 'whatsapp' | 'email' | 'in_app';
export type NotificationStatus = 'pending' | 'sent' | 'failed';

export interface Notification {
    id: string;
    organizationId: string;
    referenceType: NotificationReferenceType;
    referenceId: string;
    notifyBefore: number;
    mode: NotificationMode;
    status: NotificationStatus;
    scheduledAt: string;
    sentAt?: string | null;
}

export interface NotificationListFilter {
    organizationId?: string;
    status?: NotificationStatus;
    mode?: NotificationMode;
}