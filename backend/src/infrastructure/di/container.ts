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
import { OrganizationDocumentRepository } from '../database/repositories/organization-document.repository';

// Services
import { BcryptHashService } from '../services/bcrypt-hash.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { WhatsAppNotifierService } from '../services/whatsapp-notifier.service';
import { EmailNotifierService } from '../services/email-notifier.service';
import { RolePermissionCache } from '../cache/role-permission-cache';
import { TokenRevocationRegistry } from '../cache/token-revocation-registry';

// Use-cases
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
import { OrganizationDocumentUseCase } from '../../application/organization/use-cases/organization-document.usecase.ts';

import { EditOrganizationUseCase } from '../../application/organization/use-cases/edit-organization.use-case';
import { DeleteOrganizationUseCase } from '../../application/organization/use-cases/delete-organization.use-case';
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
import { PermissionController } from '../../presentation/controllers/permission.controller';
import { OrganizationController } from '../../presentation/controllers/organization.controller';
import { NotificationController } from '../../presentation/controllers/notification.controller';
import { DashboardController } from '../../presentation/controllers/dashboard.controller';
import { UserController } from '../../presentation/controllers/user.controller';
import { AuditLogController } from '../../presentation/controllers/audit-log.controller';
import { InviteController } from '../../presentation/controllers/invite.controller';
import { S3FileStorageService } from '../storage/s3-file-storage.service';
import { OrganizationDocumentController } from '../../presentation/controllers/organization-document.controller';
import { PlanFeatureRepository } from '../database/repositories/plan-feature.repository';
import { UpdateFeatureUseCase } from '../../application/subscription/use-cases/feature/update-feature.use-case';
import { DeleteFeatureUseCase } from '../../application/subscription/use-cases/feature/delete-feature.use-case';
import { CreateOrganizationSubscriptionUseCase } from '../../application/subscription/use-cases/organization-subscription/create-organization-subscription.use-case';
import { RenewOrganizationSubscriptionUseCase } from '../../application/subscription/use-cases/organization-subscription/renew-organization-subscription.use-case';
import { CancelOrganizationSubscriptionUseCase } from '../../application/subscription/use-cases/organization-subscription/cancel-organization-subscription.use-case';
import { AddPlanFeatureUseCase } from '../../application/subscription/use-cases/plan-feature/add-plan-feature.use-case';
import { RemovePlanFeatureUseCase } from '../../application/subscription/use-cases/plan-feature/remove-plan-feature.use-case';
import { CreateSubscriptionPlanUseCase } from '../../application/subscription/use-cases/subscription-plan/create-subscription-plan.use-case';
import { UpdateSubscriptionPlanUseCase } from '../../application/subscription/use-cases/subscription-plan/update-subscription-plan.use-case';
import { DeleteSubscriptionPlanUseCase } from '../../application/subscription/use-cases/subscription-plan/delete-subscription-plan.use-case';
import { LogoutAllDevicesUseCase } from '../../application/auth/use-cases/logout-from-alldevice';
import { OrganizationSubscriptionRepository } from '../database/repositories/organization-subscription.repository';
import { SetOrganizationAdminPasswordUseCase } from '../../application/organization/use-cases/set-organization-admin-password.use-case';
import { CancelInviteUseCase } from '../../application/organization/use-cases/Cancel-invite-use-case';
import { RequestPasswordResetUseCase } from '../../application/user/use-cases/request-password-reset.use-case';
import { ResetPasswordUseCase } from '../../application/auth/use-cases/reset-password.use-case';
import { UserResendInviteUseCase } from '../../application/user/use-cases/resend-invite.use-case';

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
  container.registerSingleton(TOKENS.OrganizationDocumentRepository, OrganizationDocumentRepository);
  container.registerSingleton(TOKENS.PlanFeatureRepository, PlanFeatureRepository),
    container.registerSingleton(TOKENS.OrganizationSubscriptionRepository, OrganizationSubscriptionRepository),

    // Services
    container.registerSingleton(TOKENS.HashService, BcryptHashService);
  container.registerSingleton(TOKENS.TokenService, JwtTokenService);
  container.registerSingleton(TOKENS.WhatsAppNotifierService, WhatsAppNotifierService);
  container.registerSingleton(TOKENS.EmailNotifierService, EmailNotifierService);
  container.registerSingleton(TOKENS.RolePermissionCache, RolePermissionCache);
  container.registerSingleton(TOKENS.TokenRevocationRegistry, TokenRevocationRegistry);
  container.registerSingleton(TOKENS.FileStorageService, S3FileStorageService);

    container.registerSingleton(TOKENS.UserResendInviteUseCase, UserResendInviteUseCase);
  container.registerSingleton(TOKENS.RequestPasswordResetUseCase, RequestPasswordResetUseCase);
  container.registerSingleton(TOKENS.ResetPasswordUseCase, ResetPasswordUseCase);


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
  container.register(TOKENS.CreateFeatureUseCase, { useClass: CreateFeatureUseCase });
  container.register(TOKENS.ScheduleNotificationUseCase, { useClass: ScheduleNotificationUseCase });
  container.register(TOKENS.SendReminderUseCase, { useClass: SendReminderUseCase });
  container.register(TOKENS.GetBusinessReportUseCase, { useClass: GetBusinessReportUseCase });
  container.register(TOKENS.OrganizationDocumentUseCase, { useClass: OrganizationDocumentUseCase });
  container.register(TOKENS.UpdateFeatureUseCase, UpdateFeatureUseCase);
  container.register(TOKENS.DeleteFeatureUseCase, DeleteFeatureUseCase);
  container.register(TOKENS.CreateOrganizationSubscriptionUseCase, CreateOrganizationSubscriptionUseCase);
  container.register(TOKENS.RenewOrganizationSubscriptionUseCase, RenewOrganizationSubscriptionUseCase);
  container.register(TOKENS.CancelOrganizationSubscriptionUseCase, CancelOrganizationSubscriptionUseCase);
  container.register(TOKENS.AddPlanFeatureUseCase, AddPlanFeatureUseCase);
  container.register(TOKENS.RemovePlanFeatureUseCase, RemovePlanFeatureUseCase);
  container.register(TOKENS.CreateSubscriptionPlanUseCase, CreateSubscriptionPlanUseCase);
  container.register(TOKENS.UpdateSubscriptionPlanUseCase, UpdateSubscriptionPlanUseCase);
  container.register(TOKENS.DeleteSubscriptionPlanUseCase, DeleteSubscriptionPlanUseCase);
  container.register(TOKENS.LogoutAllDevicesUseCase, LogoutAllDevicesUseCase);
  container.register(TOKENS.SetOrganizationAdminPasswordUseCase, SetOrganizationAdminPasswordUseCase);
  container.register(TOKENS.CancelInviteUseCase, CancelInviteUseCase);

  // Controllers
  container.registerSingleton(TOKENS.AuthController, AuthController);
  container.registerSingleton(TOKENS.RoleController, RoleController);
  container.registerSingleton(TOKENS.PermissionController, PermissionController);
  container.registerSingleton(TOKENS.OrganizationController, OrganizationController);
  container.registerSingleton(TOKENS.NotificationController, NotificationController);
  container.registerSingleton(TOKENS.DashboardController, DashboardController);
  container.registerSingleton(TOKENS.UserController, UserController);
  container.registerSingleton(TOKENS.AuditLogController, AuditLogController);
  container.registerSingleton(TOKENS.InviteController, InviteController);
  container.registerSingleton(TOKENS.OrganizationDocumentController, OrganizationDocumentController);
}

export { container };