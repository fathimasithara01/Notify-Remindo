export interface Permission {
  id: string;
  name: string;
  module: string;
  description?: string;
}

export interface CreatePermissionPayload {
  name: string;
  module: string;
  description?: string;
}