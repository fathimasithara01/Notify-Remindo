import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';


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

  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:3000',

  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || '15m') as SignOptions['expiresIn'],

  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),      
  JWT_REFRESH_EXPIRES_IN: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'], 

  COOKIE_SECRET: required('COOKIE_SECRET'),

  SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME ?? 'Super Admin',
  SUPER_ADMIN_EMAIL: required('SUPER_ADMIN_EMAIL'),
  SUPER_ADMIN_PASSWORD: required('SUPER_ADMIN_PASSWORD'),

  WHATSAPP_API_URL: process.env.WHATSAPP_API_URL ?? '',
  WHATSAPP_API_KEY: process.env.WHATSAPP_API_KEY ?? '',

  TWILIO_ACCOUNT_SID : process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM:process.env.TWILIO_WHATSAPP_FROM,
  TWILIO_CONTENT_SID: process.env.TWILIO_CONTENT_SID,

  SMTP_HOST: process.env.SMTP_HOST ?? '',
  SMTP_PORT: process.env.SMTP_PORT ?? '587',
  SMTP_USER: process.env.SMTP_USER ?? '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD ?? '',
  SMTP_FROM: process.env.SMTP_FROM ?? '',
};