import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IOrganizationRepository } from '../../domain/repositories/organization.repository.interface';
import { CreateOrganizationUseCase } from '../../application/organization/use-cases/create-organization.use-case';
import { EditOrganizationUseCase } from '../../application/organization/use-cases/edit-organization.use-case';
import { DeleteOrganizationUseCase } from '../../application/organization/use-cases/delete-organization.use-case';
import { UpgradePlanUseCase } from '../../application/organization/use-cases/upgrade-plan.use-case';
import { BlockCustomerUseCase } from '../../application/organization/use-cases/block-customer.use-case';
import { AssignSalesmanUseCase } from '../../application/organization/use-cases/assign-salesman.use-case';
import { ResendInviteUseCase } from '../../application/organization/use-cases/resend-invite.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { UnauthorizedError, NotFoundError } from '../../domain/errors/domain.error';
import { parsePagination, paginationMeta } from '../../shared/utils/pagination';

@injectable()
export class OrganizationController {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.CreateOrganizationUseCase) private createOrgUseCase: CreateOrganizationUseCase,
    @inject(TOKENS.EditOrganizationUseCase) private editOrgUseCase: EditOrganizationUseCase,
    @inject(TOKENS.DeleteOrganizationUseCase) private deleteOrgUseCase: DeleteOrganizationUseCase,
    @inject(TOKENS.UpgradePlanUseCase) private upgradePlanUseCase: UpgradePlanUseCase,
    @inject(TOKENS.BlockCustomerUseCase) private blockCustomerUseCase: BlockCustomerUseCase,
    @inject(TOKENS.AssignSalesmanUseCase) private assignSalesmanUseCase: AssignSalesmanUseCase,
    @inject(TOKENS.ResendInviteUseCase) private resendInviteUseCase: ResendInviteUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const organization = await this.createOrgUseCase.execute(req.body);
    ApiResponse.created(res, organization);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const { status, salesmanId, planId } = req.query;
    const pagination = parsePagination(req.query as Record<string, unknown>);

    const organizations = await this.orgRepo.list({
      status: status as 'active' | 'blocked' | undefined,
      salesmanId: salesmanId as string | undefined,
      planId: planId as string | undefined,
    });

    const start = (pagination.page - 1) * pagination.limit;
    const pageItems = organizations.slice(start, start + pagination.limit);

    ApiResponse.success(res, {
      items: pageItems,
      meta: paginationMeta(organizations.length, pagination),
    });
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const organization = await this.orgRepo.findById(req.params.id as string);
    if (!organization) throw new NotFoundError('Organization not found');

    const contactPersons = await this.orgRepo.listContactPersons(organization.id);
    ApiResponse.success(res, { ...organization, contactPersons });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    const organization = await this.editOrgUseCase.execute({
      organizationId: req.params.id as string,
      adminId: req.user.userId,
      data: req.body,
    });
    ApiResponse.success(res, organization, 200, 'Organization updated');
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    await this.deleteOrgUseCase.execute({
      organizationId: req.params.id as string,
      adminId: req.user.userId,
    });
    ApiResponse.success(res, null, 200, 'Organization deleted');
  };

  block = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    const organization = await this.blockCustomerUseCase.execute({
      organizationId: req.params.id as string,
      adminId: req.user.userId,
      reason: req.body.reason,
    });
    ApiResponse.success(res, organization, 200, 'Organization blocked');
  };

  unblock = async (req: Request, res: Response): Promise<void> => {
    const organization = await this.orgRepo.unblock(req.params.id as string);
    if (!organization) throw new NotFoundError('Organization not found');
    ApiResponse.success(res, organization, 200, 'Organization unblocked');
  };

  upgradePlan = async (req: Request, res: Response): Promise<void> => {
    const organization = await this.upgradePlanUseCase.execute({
      organizationId: req.params.id as string,
      newPlanId: req.body.newPlanId,
    });
    ApiResponse.success(res, organization, 200, 'Plan upgraded');
  };

  assignSalesman = async (req: Request, res: Response): Promise<void> => {
    const organization = await this.assignSalesmanUseCase.execute({
      organizationId: req.params.id as string,
      salesmanId: req.body.salesmanId,
    });
    ApiResponse.success(res, organization, 200, 'Salesman assigned');
  };

  addContactPerson = async (req: Request, res: Response): Promise<void> => {
    const contact = await this.orgRepo.addContactPerson(req.params.id as string, req.body);
    ApiResponse.created(res, contact);
  };

  listContactPersons = async (req: Request, res: Response): Promise<void> => {
    const contacts = await this.orgRepo.listContactPersons(req.params.id as string);
    ApiResponse.success(res, contacts);
  };

  resendInvite = async (req: Request, res: Response): Promise<void> => {
    await this.resendInviteUseCase.execute(req.params.id as string);
    ApiResponse.success(res, null, 200, 'Invite resent');
  };
}