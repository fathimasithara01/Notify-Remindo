import nodemailer, { Transporter } from 'nodemailer';
import { INotifierService, NotificationPayload } from '../../domain/services/notifier.service.interface';
import { env } from '../../config/env';

export class EmailNotifierService implements INotifierService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT) || 587,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });
  }

  async send(payload: NotificationPayload): Promise<void> {
    await this.transporter.sendMail({
      from: env.SMTP_FROM,
      to: payload.to,
      subject: payload.subject ?? 'Notification',
      text: payload.message,
    });
  }
}