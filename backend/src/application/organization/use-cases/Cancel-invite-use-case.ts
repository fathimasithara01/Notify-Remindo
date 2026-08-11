import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../../infrastructure/di/tokens";

import { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { IOrganizationRepository } from "../../../domain/repositories/organization.repository.interface";
import { IAuditLogRepository } from "../../../domain/repositories/audit-log.repository.interface";

import {
  DomainError,
  NotFoundError,
} from "../../../domain/errors/domain.error";

export interface CancelInviteInput {
  organizationId: string;
  adminId: string;
}

@injectable()
export class CancelInviteUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository)
    private readonly organizationRepo: IOrganizationRepository,

    @inject(TOKENS.UserRepository)
    private readonly userRepo: IUserRepository,

    @inject(TOKENS.AuditLogRepository)
    private readonly auditLogRepo: IAuditLogRepository
  ) {}

  async execute(input: CancelInviteInput): Promise<void> {
    // 1. Organization must exist
    const organization = await this.organizationRepo.findById(
      input.organizationId
    );

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    // 2. Find invited organization admin
    const admin = await this.userRepo.findOneByOrganizationAndStatus(
      input.organizationId,
      "invited"
    );

    if (!admin) {
      throw new DomainError(
        "No pending invitation found for this organization."
      );
    }

    // 3. Cancel invitation
    const cancelled = await this.userRepo.cancelInvite(admin.id);

    if (!cancelled) {
      throw new DomainError("Failed to cancel invitation.");
    }

    // 4. Audit log
    await this.auditLogRepo.create({
      adminId: input.adminId,
      action: "CANCEL_INVITE",
      targetType: "Organization",
      targetId: organization.id,
      metadata: {
        organizationId: organization.id,
        userId: admin.id,
        email: admin.email,
      },
    });
  }
}