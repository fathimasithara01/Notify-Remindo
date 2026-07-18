//  Future phase
 
export type SalesmanStatus = 'active' | 'inactive';

export interface Salesman {
  id: string;
  userId: string;
  commissionRate?: number;
  status: SalesmanStatus;
}

export type NewSalesman = Omit<Salesman, 'id' | 'status'> & {
  status?: SalesmanStatus;
};