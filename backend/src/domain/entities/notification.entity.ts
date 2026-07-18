export type NotificationReferenceType = 'PDC_ISSUED' | 'PDC_RECEIVED' | 'HR_DOC';
export type NotificationMode = 'whatsapp' | 'email';
export type NotificationStatus = 'pending' | 'sent' | 'failed';

export interface Notification {
  id: string;
  organizationId: string;
  referenceType: NotificationReferenceType;
  referenceId: string; 
  notifyBefore: number; 
  mode: NotificationMode;
  status: NotificationStatus;
  scheduledAt: Date;
  sentAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewNotification = Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'sentAt'> & {
  status?: NotificationStatus;
};