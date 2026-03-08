export enum UserRole {
  ADMIN = 'ADMIN', // System administrator (SaaS owner)
  OWNER = 'OWNER', // Tenant owner (The one who pays)
  MANAGER = 'MANAGER', // Tenant manager
  USER = 'USER' // Standard tenant user to FREE plan
}

export interface IUser {
  id?: string;
  tenantId?: string | null; // For multi-tenancy support
  username: string;
  email: string;
  document: string; // CPF or CNPJ
  password?: string;
  active: boolean;
  roles: UserRole[];
  resetPasswordToken?: string | null;
  paymentAccountId?: string;
  verificationCode?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
