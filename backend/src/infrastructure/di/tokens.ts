/**
 * tsyringe can't resolve TypeScript interfaces at runtime — interfaces
 * disappear after compilation. These tokens are runtime-identifiable
 * stand-ins that we register concrete classes against, and use with
 * @inject() wherever a constructor parameter's type is an interface.
 *
 * Concrete classes (use-cases, controllers) are also registered under
 * their own class reference directly — tsyringe supports that natively
 * via @injectable(), so they don't strictly need a token. They're listed
 * here anyway for consistency and easy discovery.
 */
export const TOKENS = {
  // Repositories (interfaces)
  UserRepository: Symbol('UserRepository'),
  RoleRepository: Symbol('RoleRepository'),
  PermissionRepository: Symbol('PermissionRepository'),
  OrganizationRepository: Symbol('OrganizationRepository'),
  SubscriptionPlanRepository: Symbol('SubscriptionPlanRepository'),
  FeatureRepository: Symbol('FeatureRepository'),
  NotificationRepository: Symbol('NotificationRepository'),
  AuditLogRepository: Symbol('AuditLogRepository'),

  // Services (interfaces)
  HashService: Symbol('HashService'),
  TokenService: Symbol('TokenService'),
  WhatsAppNotifierService: Symbol('WhatsAppNotifierService'),
  EmailNotifierService: Symbol('EmailNotifierService'),
  InAppNotifierService: Symbol('InAppNotifierService'),
  NotifierMap: Symbol('NotifierMap'),

  // Use-cases (concrete classes, registered for discoverability/consistency)
  LoginAdminUseCase: Symbol('LoginAdminUseCase'),
  RefreshTokenUseCase: Symbol('RefreshTokenUseCase'),
  GetCurrentUserUseCase: Symbol('GetCurrentUserUseCase'),
  VerifyInviteTokenUseCase: Symbol('VerifyInviteTokenUseCase'),
  AcceptInviteUseCase: Symbol('AcceptInviteUseCase'),
  ResendInviteUseCase: Symbol('ResendInviteUseCase'),
  CreateUserUseCase: Symbol('CreateUserUseCase'),
  EditUserUseCase: Symbol('EditUserUseCase'),
  RevokeSessionsUseCase: Symbol('RevokeSessionsUseCase'),
  CreateRoleUseCase: Symbol('CreateRoleUseCase'),
  AssignPermissionsUseCase: Symbol('AssignPermissionsUseCase'),
  EditRoleUseCase: Symbol('EditRoleUseCase'),
  DeleteRoleUseCase: Symbol('DeleteRoleUseCase'),
  CreateOrganizationUseCase: Symbol('CreateOrganizationUseCase'),
  EditOrganizationUseCase: Symbol('EditOrganizationUseCase'),
  DeleteOrganizationUseCase: Symbol('DeleteOrganizationUseCase'),
  UpgradePlanUseCase: Symbol('UpgradePlanUseCase'),
  BlockCustomerUseCase: Symbol('BlockCustomerUseCase'),
  AssignSalesmanUseCase: Symbol('AssignSalesmanUseCase'),
  CreatePlanUseCase: Symbol('CreatePlanUseCase'),
  EditPlanUseCase: Symbol('EditPlanUseCase'),
  CreateFeatureUseCase: Symbol('CreateFeatureUseCase'),
  ScheduleNotificationUseCase: Symbol('ScheduleNotificationUseCase'),
  SendReminderUseCase: Symbol('SendReminderUseCase'),
  GetBusinessReportUseCase: Symbol('GetBusinessReportUseCase'),

  // Controllers
  AuthController: Symbol('AuthController'),
  RoleController: Symbol('RoleController'),
  PermissionController: Symbol('PermissionController'),
  OrganizationController: Symbol('OrganizationController'),
  SubscriptionController: Symbol('SubscriptionController'),
  NotificationController: Symbol('NotificationController'),
  DashboardController: Symbol('DashboardController'),
  UserController: Symbol('UserController'),
  AuditLogController: Symbol('AuditLogController'),
} as const;