import dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT) || 5000,

  MONGODB_URI: required('MONGODB_URI'),

  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN ?? '1d') as StringValue,

  COOKIE_SECRET: required('COOKIE_SECRET'),

  SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME ?? 'Super Admin',
  SUPER_ADMIN_EMAIL: required('SUPER_ADMIN_EMAIL'),
  SUPER_ADMIN_PASSWORD: required('SUPER_ADMIN_PASSWORD'),

  // WHATSAPP_API_URL: process.env.WHATSAPP_API_URL ?? '',
  // WHATSAPP_API_KEY: process.env.WHATSAPP_API_KEY ?? '',

  TWILIO_ACCOUNT_SID: required("TWILIO_ACCOUNT_SID"),
  TWILIO_AUTH_TOKEN: required("TWILIO_AUTH_TOKEN"),
  TWILIO_WHATSAPP_FROM: required("TWILIO_WHATSAPP_FROM"),
  TWILIO_CONTENT_SID: required("TWILIO_CONTENT_SID"),

  SMTP_HOST: process.env.SMTP_HOST ?? '',
  SMTP_PORT: process.env.SMTP_PORT ?? '587',
  SMTP_USER: process.env.SMTP_USER ?? '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD ?? '',
  SMTP_FROM: process.env.SMTP_FROM ?? '',
};