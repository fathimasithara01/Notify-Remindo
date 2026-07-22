import 'reflect-metadata';
import { container } from 'tsyringe';
import { TOKENS } from './tokens';

// Repositories
import { UserRepository } from '../database/repositories/user.repository';
import { RoleRepository } from '../database/repositories/role.repository';
import { PermissionRepository } from '../database/repositories/permission.repository';
import { OrganizationRepository } from '../database/repositories/organization.repository';
import { SubscriptionPlanRepository } from '../database/repositories/subscription-plan.repository';
import { FeatureRepository } from '../database/repositories/feature.repository';
import { NotificationRepository } from '../database/repositories/notification.repository';
import { AuditLogRepository } from '../database/repositories/audit-log.repository';

import { BcryptHashService } from '../services/bcrypt-hash.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { WhatsAppNotifierService } from '../services/whatsapp-notifier.service';
import { EmailNotifierService } from '../services/email-notifier.service';

import { LoginAdminUseCase } from '../../application/auth/use-cases/login-admin.use-case';
import { RefreshTokenUseCase } from '../../application/auth/use-cases/refresh-token.use-case';
import { GetCurrentUserUseCase } from '../../application/auth/use-cases/get-current-user.use-case';
import { VerifyInviteTokenUseCase } from '../../application/auth/use-cases/verify-invite-token.use-case';
import { AcceptInviteUseCase } from '../../application/auth/use-cases/accept-invite.use-case';
import { ResendInviteUseCase } from '../../application/organization/use-cases/resend-invite.use-case';
import { CreateUserUseCase } from '../../application/user/use-cases/create-user.use-case';
import { EditUserUseCase } from '../../application/user/use-cases/edit-user.use-case';
import { RevokeSessionsUseCase } from '../../application/user/use-cases/revoke-sessions.use-case';
import { CreateRoleUseCase } from '../../application/role/use-cases/create-role.use-case';
import { AssignPermissionsUseCase } from '../../application/role/use-cases/assign-permissions.use-case';
import { EditRoleUseCase } from '../../application/role/use-cases/edit-role.use-case';
import { DeleteRoleUseCase } from '../../application/role/use-cases/delete-role.use-case';
import { CreateOrganizationUseCase } from '../../application/organization/use-cases/create-organization.use-case';
import { EditOrganizationUseCase } from '../../application/organization/use-cases/edit-organization.use-case';
import { DeleteOrganizationUseCase } from '../../application/organization/use-cases/delete-organization.use-case';
import { UpgradePlanUseCase } from '../../application/organization/use-cases/upgrade-plan.use-case';
import { BlockCustomerUseCase } from '../../application/organization/use-cases/block-customer.use-case';
import { AssignSalesmanUseCase } from '../../application/organization/use-cases/assign-salesman.use-case';
import { CreatePlanUseCase } from '../../application/subscription/use-cases/create-plan.use-case';
import { EditPlanUseCase } from '../../application/subscription/use-cases/edit-plan.use-case';
import { CreateFeatureUseCase } from '../../application/subscription/use-cases/create-feature.use-case';
import { ScheduleNotificationUseCase } from '../../application/notification/use-cases/schedule-notification.use-case';
import { SendReminderUseCase } from '../../application/notification/use-cases/send-reminder.use-case';
import { GetBusinessReportUseCase } from '../../application/dashboard/use-cases/get-business-report.use-case';

// Controllers
import { AuthController } from '../../presentation/controllers/auth.controller';
import { RoleController } from '../../presentation/controllers/role.controller';
import { PermissionController } from '../../presentation/controllers/permission.controller';
import { OrganizationController } from '../../presentation/controllers/organization.controller';
import { SubscriptionController } from '../../presentation/controllers/subscription.controller';
import { NotificationController } from '../../presentation/controllers/notification.controller';
import { DashboardController } from '../../presentation/controllers/dashboard.controller';
import { UserController } from '../../presentation/controllers/user.controller';
import { AuditLogController } from '../../presentation/controllers/audit-log.controller';


export function registerDependencies(): void {
  // Repositories
  container.registerSingleton(TOKENS.UserRepository, UserRepository);
  container.registerSingleton(TOKENS.RoleRepository, RoleRepository);
  container.registerSingleton(TOKENS.PermissionRepository, PermissionRepository);
  container.registerSingleton(TOKENS.OrganizationRepository, OrganizationRepository);
  container.registerSingleton(TOKENS.SubscriptionPlanRepository, SubscriptionPlanRepository);
  container.registerSingleton(TOKENS.FeatureRepository, FeatureRepository);
  container.registerSingleton(TOKENS.NotificationRepository, NotificationRepository);
  container.registerSingleton(TOKENS.AuditLogRepository, AuditLogRepository);

  // Services
  container.registerSingleton(TOKENS.HashService, BcryptHashService);
  container.registerSingleton(TOKENS.TokenService, JwtTokenService);
  container.registerSingleton(TOKENS.WhatsAppNotifierService, WhatsAppNotifierService);
  container.registerSingleton(TOKENS.EmailNotifierService, EmailNotifierService);

  container.register(TOKENS.NotifierMap, {
    useFactory: (c) => ({
      whatsapp: c.resolve(TOKENS.WhatsAppNotifierService),
      email: c.resolve(TOKENS.EmailNotifierService),
    }),
  });

  container.register(TOKENS.LoginAdminUseCase, { useClass: LoginAdminUseCase });
  container.register(TOKENS.RefreshTokenUseCase, { useClass: RefreshTokenUseCase });
  container.register(TOKENS.GetCurrentUserUseCase, { useClass: GetCurrentUserUseCase });
  container.register(TOKENS.VerifyInviteTokenUseCase, { useClass: VerifyInviteTokenUseCase });
  container.register(TOKENS.AcceptInviteUseCase, { useClass: AcceptInviteUseCase });
  container.register(TOKENS.ResendInviteUseCase, { useClass: ResendInviteUseCase });
  container.register(TOKENS.CreateUserUseCase, { useClass: CreateUserUseCase });
  container.register(TOKENS.EditUserUseCase, { useClass: EditUserUseCase });
  container.register(TOKENS.RevokeSessionsUseCase, { useClass: RevokeSessionsUseCase });
  container.register(TOKENS.CreateRoleUseCase, { useClass: CreateRoleUseCase });
  container.register(TOKENS.AssignPermissionsUseCase, { useClass: AssignPermissionsUseCase });
  container.register(TOKENS.EditRoleUseCase, { useClass: EditRoleUseCase });
  container.register(TOKENS.DeleteRoleUseCase, { useClass: DeleteRoleUseCase });
  container.register(TOKENS.CreateOrganizationUseCase, { useClass: CreateOrganizationUseCase });
  container.register(TOKENS.EditOrganizationUseCase, { useClass: EditOrganizationUseCase });
  container.register(TOKENS.DeleteOrganizationUseCase, { useClass: DeleteOrganizationUseCase });
  container.register(TOKENS.UpgradePlanUseCase, { useClass: UpgradePlanUseCase });
  container.register(TOKENS.BlockCustomerUseCase, { useClass: BlockCustomerUseCase });
  container.register(TOKENS.AssignSalesmanUseCase, { useClass: AssignSalesmanUseCase });
  container.register(TOKENS.CreatePlanUseCase, { useClass: CreatePlanUseCase });
  container.register(TOKENS.EditPlanUseCase, { useClass: EditPlanUseCase });
  container.register(TOKENS.CreateFeatureUseCase, { useClass: CreateFeatureUseCase });
  container.register(TOKENS.ScheduleNotificationUseCase, { useClass: ScheduleNotificationUseCase });
  container.register(TOKENS.SendReminderUseCase, { useClass: SendReminderUseCase });
  container.register(TOKENS.GetBusinessReportUseCase, { useClass: GetBusinessReportUseCase });

  // Controllers
  container.registerSingleton(TOKENS.AuthController, AuthController);
  container.registerSingleton(TOKENS.RoleController, RoleController);
  container.registerSingleton(TOKENS.PermissionController, PermissionController);
  container.registerSingleton(TOKENS.OrganizationController, OrganizationController);
  container.registerSingleton(TOKENS.SubscriptionController, SubscriptionController);
  container.registerSingleton(TOKENS.NotificationController, NotificationController);
  container.registerSingleton(TOKENS.DashboardController, DashboardController);
  container.registerSingleton(TOKENS.UserController, UserController);
  container.registerSingleton(TOKENS.AuditLogController, AuditLogController);
}

export { container };