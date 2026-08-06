// import { injectable, inject } from 'tsyringe';
// import { TOKENS } from '../../../infrastructure/di/tokens';
// import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
// import { IHashService } from '../../../domain/services/hash.service.interface';
// import { User } from '../../../domain/entities/user.entity';
// import { DomainError } from '../../../domain/errors/domain.error';
// import { AcceptInviteDto } from '../../dtos/accept-invite.dto';

// @injectable()
// export class AcceptInviteUseCase {
//     constructor(
//         @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
//         @inject(TOKENS.HashService) private hashService: IHashService
//     ) { }

//     async execute(data: AcceptInviteDto): Promise<User> {
//         const user = await this.userRepo.findByInviteToken(data.token);

//         if (!user) {
//             throw new DomainError('Invalid or expired invite link');
//         }

//         if (!user.inviteTokenExpiresAt || user.inviteTokenExpiresAt < new Date()) {
//             throw new DomainError('This invite link has expired. Please request a new one.');
//         }

//         if (user.status !== 'invited') {
//             throw new DomainError('This invite has already been used');
//         }

//         const passwordHash = await this.hashService.hash(data.password);

//         const updatedUser = await this.userRepo.update(user.id, {
//             passwordHash,
//             status: 'active',
//             inviteToken: null,
//             inviteTokenExpiresAt: null,
//         });

//         if (!updatedUser) {
//             throw new DomainError('Failed to activate account. Please try again.');
//         }

//         return updatedUser;
//     }
// }