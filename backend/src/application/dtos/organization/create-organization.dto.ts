
export interface CreateOrganizationDto {
  name: string

  businessEmail: string;
  businessPhone: string;
  address: string;

  planId?: string;
  salesmanId?: string;

  admin: {
    firstName: string;
    lastName: string;
    phone: string;
    password:string;
    email: string;
  };
}

export interface EditOrganizationAdminDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}