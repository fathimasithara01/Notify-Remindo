import { connectDB, disconnectDB } from '../../config/db';
import { SubscriptionPlanModel } from '../database/models/subscription-plan.model';

const PLANS = [
  {
    name: 'Basic',
    userLimit: 5,
    durationDays: 30,
    price: 999,
    description: 'For small teams getting started with PDC and reminder tracking.',
  },
  {
    name: 'Standard',
    userLimit: 20,
    durationDays: 30,
    price: 2999,
    description: 'For growing organizations that need WhatsApp and email reminders.',
  },
  {
    name: 'Premium',
    userLimit: 100,
    durationDays: 30,
    price: 7999,
    description: 'Full feature access including HR module and advanced reporting.',
  },
];

export async function seedSubscriptionPlans(): Promise<void> {
  for (const plan of PLANS) {
    await SubscriptionPlanModel.findOneAndUpdate(
      { name: plan.name },
      { $setOnInsert: plan },
      { upsert: true }
    );
  }
  console.log(`Seeded ${PLANS.length} subscription plans (existing ones left untouched)`);
}

if (require.main === module) {
  connectDB()
    .then(seedSubscriptionPlans)
    .then(disconnectDB)
    .catch((error) => {
      console.error('Subscription plan seed failed:', error);
      process.exit(1);
    });
}