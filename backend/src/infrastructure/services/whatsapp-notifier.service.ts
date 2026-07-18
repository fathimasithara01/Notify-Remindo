import twilio from 'twilio';
import { INotifierService, NotificationPayload } from '../../domain/services/notifier.service.interface';
import { env } from '../../config/env';

export class WhatsAppNotifierService implements INotifierService {
    private client = twilio(
        env.TWILIO_ACCOUNT_SID,
        env.TWILIO_AUTH_TOKEN
    );

    async send(payload: NotificationPayload): Promise<void> {
        try {
            console.log("Payload:", payload);

            await this.client.messages.create({
                from: env.TWILIO_WHATSAPP_FROM,
                to: `whatsapp:${payload.to}`,
                contentSid: env.TWILIO_CONTENT_SID,
                contentVariables: JSON.stringify({
                    "1": payload.date,
                    "2": payload.time,
                }),
            });
        } catch (error) {
            throw new Error(
                `WhatsApp send failed: ${(error as Error).message}`
            );
        }
    }
}