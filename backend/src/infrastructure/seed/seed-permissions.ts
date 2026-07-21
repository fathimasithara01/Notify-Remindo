import { connectDB, disconnectDB } from '../../config/db';
import { PermissionModel } from '../database/models/permission.model';

const PERMISSIONS: Array<{ name: string; module: string; description: string }> = [
  { name: 'role.create', module: 'role', description: 'Create new roles' },
  { name: 'role.view', module: 'role', description: 'View roles' },
  { name: 'role.edit', module: 'role', description: 'Edit roles and assign permissions' },
  { name: 'role.delete', module: 'role', description: 'Delete non-system roles' },

  { name: 'permission.create', module: 'permission', description: 'Create permissions' },
  { name: 'permission.view', module: 'permission', description: 'View permissions' },
  { name: 'permission.edit', module: 'permission', description: 'Edit permissions' },
  { name: 'permission.delete', module: 'permission', description: 'Delete permissions' },

  { name: 'organization.create', module: 'organization', description: 'Onboard new organizations' },
  { name: 'organization.view', module: 'organization', description: 'View organizations' },
  { name: 'organization.edit', module: 'organization', description: 'Edit organization details' },
  { name: 'organization.delete', module: 'organization', description: 'Delete (soft-delete) an organization' },
  { name: 'organization.block', module: 'organization', description: 'Block/unblock organizations' },
  { name: 'organization.upgrade_plan', module: 'organization', description: 'Upgrade an organization\'s subscription plan' },
  { name: 'organization.assign_salesman', module: 'organization', description: 'Assign a salesman to an organization' },

  { name: 'contact_person.create', module: 'contact_person', description: 'Add contact persons to an organization' },
  { name: 'contact_person.view', module: 'contact_person', description: 'View contact persons' },
  { name: 'contact_person.edit', module: 'contact_person', description: 'Edit contact persons' },
  { name: 'contact_person.delete', module: 'contact_person', description: 'Delete contact persons' },

  { name: 'plan.create', module: 'plan', description: 'Create subscription plans' },
  { name: 'plan.view', module: 'plan', description: 'View subscription plans' },
  { name: 'plan.edit', module: 'plan', description: 'Edit subscription plans' },
  { name: 'plan.delete', module: 'plan', description: 'Delete subscription plans' },

  { name: 'feature.create', module: 'feature', description: 'Create feature definitions' },
  { name: 'feature.view', module: 'feature', description: 'View feature definitions' },

  { name: 'notification.create', module: 'notification', description: 'Schedule notifications' },
  { name: 'notification.view', module: 'notification', description: 'View notifications' },
  { name: 'notification.send', module: 'notification', description: 'Manually trigger a notification' },
  { name: 'notification.delete', module: 'notification', description: 'Cancel a notification' },

  { name: 'dashboard.view', module: 'dashboard', description: 'View business reports' },
];

export async function seedPermissions(): Promise<void> {
  for (const permission of PERMISSIONS) {
    await PermissionModel.findOneAndUpdate(
      { name: permission.name },
      { $setOnInsert: permission },
      { upsert: true }
    );
  }
  console.log(`Seeded ${PERMISSIONS.length} permissions (existing ones left untouched)`);
}

if (require.main === module) {
  connectDB()
    .then(seedPermissions)
    .then(disconnectDB)
    .catch((error) => {
      console.error('Permission seed failed:', error);
      process.exit(1);
    });
}