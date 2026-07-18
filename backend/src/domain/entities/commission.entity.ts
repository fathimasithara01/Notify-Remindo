//  Future phase 
export type CommissionStatus = 'pending' | 'paid';

export interface Commission {
  id: string;
  salesmanId: string;
  organizationId: string;
  amount: number;
  status: CommissionStatus;
}

export type NewCommission = Omit<Commission, 'id'>;