export interface NotificationPayload {
    to: string;
    subject?: string;
    message?: string;
    date?:string;
    time?:string;
}

export interface INotifierService {
    send(payload: NotificationPayload): Promise<void>;
}