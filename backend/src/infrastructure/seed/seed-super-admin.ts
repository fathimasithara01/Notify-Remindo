import { Types } from 'mongoose';
import { connectDB, disconnectDB } from '../../config/db';
import { RoleModel } from '../database/models/role.model';
import { PlatformUserModel } from '../database/models/platform-user.model';
import { BcryptHashService } from '../services/bcrypt-hash.service';
import { env } from '../../config/env';
import { ALL_PERMISSIONS } from '../../shared/constants/permissions.constant';

const SYSTEM_USER_ID = new Types.ObjectId('000000000000000000000000');

export async function seedSuperAdmin(): Promise<void> {
  const superAdminRole = await RoleModel.findOneAndUpdate(
    { name: 'Super Admin' },
    {
      $set: {
        description: 'Full system access — built-in role',
        isSystem: true,
        status: 'active',
        permissionIds: ALL_PERMISSIONS,
      },
      $setOnInsert: {
        name: 'Super Admin',
        createdBy: SYSTEM_USER_ID,
        deletion: { isDeleted: false },
      },
    },
    { upsert: true, new: true }
  );

  await RoleModel.findOneAndUpdate(
    { name: 'Org Admin' },
    {
      $setOnInsert: {
        name: 'Org Admin',
        description: 'Administrator for a subscribing organization',
        isSystem: true,
        status: 'active',
        permissionIds: [],
        createdBy: SYSTEM_USER_ID,
        deletion: { isDeleted: false },
      },
    },
    { upsert: true }
  );

  const existing = await PlatformUserModel.findOne({ email: env.SUPER_ADMIN_EMAIL });
  if (existing) {
    console.log('Super Admin user already exists — skipping user creation');
    return;
  }

  const hashService = new BcryptHashService();
  const passwordHash = await hashService.hash(env.SUPER_ADMIN_PASSWORD);

  await PlatformUserModel.create({
    firstName: env.SUPER_ADMIN_FIRST_NAME,
    lastName: env.SUPER_ADMIN_LAST_NAME,
    email: env.SUPER_ADMIN_EMAIL,
    passwordHash,
    status: 'active',
    mustChangePassword: false,
    roleId: superAdminRole!._id,
  });

  console.log(`Super Admin user created: ${env.SUPER_ADMIN_EMAIL}`);
}

if (require.main === module) {
  connectDB()
    .then(seedSuperAdmin)
    .then(disconnectDB)
    .catch((error) => {
      console.error('Super Admin seed failed:', error);
      process.exit(1);
    });
}