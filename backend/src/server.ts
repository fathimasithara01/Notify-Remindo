import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { startReminderScheduler } from './infrastructure/jobs/reminder-scheduler.job';

async function bootstrap(): Promise<void> {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Notify backend running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  startReminderScheduler();
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});