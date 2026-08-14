import 'reflect-metadata';
import { container } from 'tsyringe';
import { TOKENS } from './tokens';

// Repositories
import { UserRepository } from '../database/repositories/user.repository';
import { PLatformRoleRepository } from '../database/repositories/platform-role.repository';
import { SubscriptionPlanRepository } from '../database/repositories/subscription-plan.repository';
import { FeatureRepository } from '../database/repositories/feature.repository';
import { NotificationRepository } from '../database/repositories/notification.repository';
import { AuditLogRepository } from '../database/repositories/audit-log.repository';

// Services
import { BcryptHashService } from '../services/bcrypt-hash.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { EmailNotifierService } from '../services/email-notifier.service';
import { TokenRevocationRegistry } from '../cache/token-revocation-registry';

// Use-cases
import { LoginAdminUseCase } from '../../application/auth/use-cases/login-admin.use-case';
import { RefreshTokenUseCase } from '../../application/auth/use-cases/refresh-token.use-case';
import { GetCurrentUserUseCase } from '../../application/auth/use-cases/get-current-user.use-case';
import { CreateUserUseCase } from '../../application/user/use-cases/create-user.use-case';
import { EditUserUseCase } from '../../application/user/use-cases/edit-user.use-case';
import { RevokeSessionsUseCase } from '../../application/platform-user/use-cases/revoke-sessions.use-case';
import { CreateRoleUseCase } from '../../application/role/use-cases/create-role.use-case';
import { EditRoleUseCase } from '../../application/role/use-cases/edit-role.use-case';
import { DeleteRoleUseCase } from '../../application/role/use-cases/delete-role.use-case';
import { CreateOrganizationUseCase } from '../../application/organization/use-cases/create-organization.use-case';

import { EditOrganizationUseCase } from '../../application/organization/use-cases/edit-organization.use-case';
// import { DeleteOrganizationUseCase } from '../../application/organization/use-cases/delete-organization.use-case';
import { UpgradePlanUseCase } from '../../application/organization/use-cases/upgrade-plan.use-case';
import { BlockCustomerUseCase } from '../../application/organization/use-cases/block-customer.use-case';
import { AssignSalesmanUseCase } from '../../application/organization/use-cases/assign-salesman.use-case';
import { CreateFeatureUseCase } from '../../application/subscription/use-cases/feature/create-feature.use-case';
import { ScheduleNotificationUseCase } from '../../application/notification/use-cases/schedule-notification.use-case';
import { SendReminderUseCase } from '../../application/notification/use-cases/send-reminder.use-case';
import { GetBusinessReportUseCase } from '../../application/dashboard/use-cases/get-business-report.use-case';

// Controllers
import { AuthController } from '../../presentation/controllers/auth.controller';
import { RoleController } from '../../presentation/controllers/role.controller';
import { OrganizationController } from '../../presentation/controllers/organization.controller';
import { NotificationController } from '../../presentation/controllers/notification.controller';
import { DashboardController } from '../../presentation/controllers/dashboard.controller';
import { UserController } from '../../presentation/controllers/user.controller';
import { AuditLogController } from '../../presentation/controllers/audit-log.controller';
import { UpdateFeatureUseCase } from '../../application/subscription/use-cases/feature/update-feature.use-case';
import { DeleteFeatureUseCase } from '../../application/subscription/use-cases/feature/delete-feature.use-case';
import { CreateSubscriptionPlanUseCase } from '../../application/subscription/use-cases/subscription-plan/create-subscription-plan.use-case';
import { UpdateSubscriptionPlanUseCase } from '../../application/subscription/use-cases/subscription-plan/update-subscription-plan.use-case';
import { DeleteSubscriptionPlanUseCase } from '../../application/subscription/use-cases/subscription-plan/delete-subscription-plan.use-case';
import { LogoutAllDevicesUseCase } from '../../application/auth/use-cases/logout-from-alldevice';
import { SetOrganizationAdminPasswordUseCase } from '../../application/organization/use-cases/set-organization-admin-password.use-case';
import { RequestPasswordResetUseCase } from '../../application/platform-user/use-cases/request-password-reset.use-case';
import { ResetPasswordUseCase } from '../../application/auth/use-cases/reset-password.use-case';
import { ChangePasswordUseCase } from '../../application/auth/use-cases/change-password.use-case';
import { PermissionResolver } from '../services/PermissionResolver';
import { ListRolesUseCase } from '../../application/role/use-cases/list-roles.use-case';
import { PlatformUserRepository } from '../database/repositories/PlatformUserRepository';
import { CreatePlatformUserUseCase } from '../../application/platform-user/use-cases/create-platform-user.use-case';
import { EditPlatformUserUseCase } from '../../application/platform-user/use-cases/edit-platform-user.use-case';
import { ListPlatformUsersUseCase } from '../../application/platform-user/use-cases/list-platform-users.use-case';
import { DeletePlatformUserUseCase } from '../../application/platform-user/use-cases/delete-platform-user.use-case';
import { PlatformUserController } from '../../presentation/controllers/platform-user.controller';
import { OrganizationRepository } from '../database/repositories/organization.repository';
import { RevokeUserSessionsUseCase } from '../../application/user/use-cases/revoke-sessions.use-case';
import { GetPlatformUserUseCase } from '../../application/platform-user/use-cases/get-platform-user.use-case';
import { BlockPlatformUserUseCase } from '../../application/platform-user/use-cases/block-platform-user.use-case';
import { UnblockPlatformUserUseCase } from '../../application/platform-user/use-cases/unblock-platform-user.use-cas';
import { UpdateOrganizationAdminUseCase } from '../../application/organization/use-cases/update-organization-admin.usecase';

export function registerDependencies(): void {
  // Repositories
  container.registerSingleton(TOKENS.UserRepository, UserRepository);
  container.registerSingleton(TOKENS.PlatformRoleRepository, PLatformRoleRepository);
  container.registerSingleton(TOKENS.OrganizationRepository, OrganizationRepository);
  container.registerSingleton(TOKENS.SubscriptionPlanRepository, SubscriptionPlanRepository);
  container.registerSingleton(TOKENS.FeatureRepository, FeatureRepository);
  container.registerSingleton(TOKENS.NotificationRepository, NotificationRepository);
  container.registerSingleton(TOKENS.AuditLogRepository, AuditLogRepository);
  container.registerSingleton(TOKENS.RevokeUserSessionsUseCase, RevokeUserSessionsUseCase),
    container.registerSingleton(TOKENS.UpdateOrganizationAdminUseCase, UpdateOrganizationAdminUseCase),

    container.register(TOKENS.BlockPlatformUserUseCase, { useClass: BlockPlatformUserUseCase });
  container.register(TOKENS.UnblockPlatformUserUseCase, { useClass: UnblockPlatformUserUseCase });
  // Services
  container.registerSingleton(TOKENS.HashService, BcryptHashService);
  container.registerSingleton(TOKENS.TokenService, JwtTokenService);
  container.registerSingleton(TOKENS.EmailNotifierService, EmailNotifierService);
  container.registerSingleton(TOKENS.TokenRevocationRegistry, TokenRevocationRegistry);
  container.registerSingleton(TOKENS.RequestPasswordResetUseCase, RequestPasswordResetUseCase);
  container.registerSingleton(TOKENS.ResetPasswordUseCase, ResetPasswordUseCase);
  container.registerSingleton(TOKENS.ChangePasswordUseCase, ChangePasswordUseCase);

  container.register(TOKENS.NotifierMap, {
    useFactory: (c) => ({
      whatsapp: c.resolve(TOKENS.WhatsAppNotifierService),
      email: c.resolve(TOKENS.EmailNotifierService),
    }),
  });

  container.register(TOKENS.LoginAdminUseCase, { useClass: LoginAdminUseCase });
  container.register(TOKENS.RefreshTokenUseCase, { useClass: RefreshTokenUseCase });
  container.register(TOKENS.GetCurrentUserUseCase, { useClass: GetCurrentUserUseCase });
  container.register(TOKENS.CreateUserUseCase, { useClass: CreateUserUseCase });
  container.register(TOKENS.EditUserUseCase, { useClass: EditUserUseCase });
  container.register(TOKENS.RevokeSessionsUseCase, { useClass: RevokeSessionsUseCase });
  container.register(TOKENS.CreateRoleUseCase, { useClass: CreateRoleUseCase });
  container.register(TOKENS.EditRoleUseCase, { useClass: EditRoleUseCase });
  container.register(TOKENS.DeleteRoleUseCase, { useClass: DeleteRoleUseCase });
  container.register(TOKENS.CreateOrganizationUseCase, { useClass: CreateOrganizationUseCase });
  container.register(TOKENS.EditOrganizationUseCase, { useClass: EditOrganizationUseCase });
  container.register(TOKENS.UpgradePlanUseCase, { useClass: UpgradePlanUseCase });
  container.register(TOKENS.BlockCustomerUseCase, { useClass: BlockCustomerUseCase });
  container.register(TOKENS.AssignSalesmanUseCase, { useClass: AssignSalesmanUseCase });
  container.register(TOKENS.CreateFeatureUseCase, { useClass: CreateFeatureUseCase });
  container.register(TOKENS.ScheduleNotificationUseCase, { useClass: ScheduleNotificationUseCase });
  container.register(TOKENS.GetBusinessReportUseCase, { useClass: GetBusinessReportUseCase });
  container.register(TOKENS.UpdateFeatureUseCase, UpdateFeatureUseCase);
  container.register(TOKENS.DeleteFeatureUseCase, DeleteFeatureUseCase);

  container.register(TOKENS.CreateSubscriptionPlanUseCase, CreateSubscriptionPlanUseCase);
  container.register(TOKENS.UpdateSubscriptionPlanUseCase, UpdateSubscriptionPlanUseCase);
  container.register(TOKENS.DeleteSubscriptionPlanUseCase, DeleteSubscriptionPlanUseCase);
  container.register(TOKENS.LogoutAllDevicesUseCase, LogoutAllDevicesUseCase);
  container.register(TOKENS.SetOrganizationAdminPasswordUseCase, SetOrganizationAdminPasswordUseCase);
  container.register(TOKENS.GetPlatformUserUseCase, GetPlatformUserUseCase);


  // Controllers
  container.registerSingleton(TOKENS.AuthController, AuthController);
  container.registerSingleton(TOKENS.RoleController, RoleController);
  container.registerSingleton(TOKENS.OrganizationController, OrganizationController);
  container.registerSingleton(TOKENS.NotificationController, NotificationController);
  container.registerSingleton(TOKENS.DashboardController, DashboardController);
  container.registerSingleton(TOKENS.UserController, UserController);
  container.registerSingleton(TOKENS.AuditLogController, AuditLogController);

  container.registerSingleton(TOKENS.PermissionResolver, PermissionResolver);
  container.register(TOKENS.ListRolesUseCase, { useClass: ListRolesUseCase });
  container.registerSingleton(TOKENS.PlatformUserRepository, PlatformUserRepository);

  // di/register.ts
  container.register(TOKENS.CreatePlatformUserUseCase, { useClass: CreatePlatformUserUseCase });
  container.register(TOKENS.EditPlatformUserUseCase, { useClass: EditPlatformUserUseCase });
  container.register(TOKENS.ListPlatformUsersUseCase, { useClass: ListPlatformUsersUseCase });
  container.register(TOKENS.DeletePlatformUserUseCase, { useClass: DeletePlatformUserUseCase });
  container.registerSingleton(TOKENS.PlatformUserController, PlatformUserController);
}

export { container };