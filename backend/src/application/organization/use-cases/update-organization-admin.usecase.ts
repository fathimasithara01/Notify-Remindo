import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { NotFoundError } from '../../../domain/errors/domain.error';
import { EditOrganizationAdminDto } from '../../dtos/organization/create-organization.dto';

@injectable()
export class UpdateOrganizationAdminUseCase {
    constructor(
        @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
        @inject(TOKENS.UserRepository) private userRepo: IUserRepository
    ) { }

    async execute(organizationId: string, data: EditOrganizationAdminDto) {
        const org = await this.orgRepo.findById(organizationId);
        if (!org) throw new NotFoundError('Organization not found');

        if (!org.admin) {
            throw new NotFoundError('Organization admin not found');
        }

        const updated = await this.userRepo.update(org.admin.id, {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
        });

        if (!updated) throw new NotFoundError('User not found');

        return updated;
    }
}