import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { GetBusinessReportUseCase } from '../../application/dashboard/use-cases/get-business-report.use-case';
import { ApiResponse } from '../../shared/utils/api-response';

@injectable()
export class DashboardController {
  constructor(
    @inject(TOKENS.GetBusinessReportUseCase) private getBusinessReportUseCase: GetBusinessReportUseCase
  ) {}

  getReport = async (_req: Request, res: Response): Promise<void> => {
    const report = await this.getBusinessReportUseCase.execute();
    ApiResponse.success(res, report);
  };
}