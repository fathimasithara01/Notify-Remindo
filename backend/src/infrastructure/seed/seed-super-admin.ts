import { connectDB, disconnectDB } from '../../config/db';
import { RoleModel } from '../database/models/role.model';
import { PermissionModel } from '../database/models/permission.model';
import { RolePermissionModel } from '../database/models/role-permission.model';
import { UserModel } from '../database/models/user.model';
import { BcryptHashService } from '../services/bcrypt-hash.service';
import { seedPermissions } from './seed-permissions';
import { env } from '../../config/env';

export async function seedSuperAdmin(): Promise<void> {
  await seedPermissions();

  const role = await RoleModel.findOneAndUpdate(
    { slug: 'superadmin' },
    {
      $setOnInsert: {
        name: 'Super Admin',
        slug: 'superadmin',
        description: 'Full system access — built-in role',
        isSystem: true,
        status: 'active',
      },
    },
    { upsert: true, new: true }
  );

  const allPermissions = await PermissionModel.find({});
  const ops = allPermissions.map((permission) => ({
    updateOne: {
      filter: { roleId: role._id, permissionId: permission._id },
      update: { $setOnInsert: { roleId: role._id, permissionId: permission._id } },
      upsert: true,
    },
  }));
  if (ops.length > 0) {
    await RolePermissionModel.bulkWrite(ops);
  }

  const existing = await UserModel.findOne({ email: env.SUPER_ADMIN_EMAIL });
  if (existing) {
    console.log('Super Admin user already exists — skipping user creation');
    return;
  }

  const hashService = new BcryptHashService();
  const passwordHash = await hashService.hash(env.SUPER_ADMIN_PASSWORD);

  await UserModel.create({
    name: env.SUPER_ADMIN_NAME,
    email: env.SUPER_ADMIN_EMAIL,
    passwordHash,
    roleId: role._id,
    status: 'active',
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