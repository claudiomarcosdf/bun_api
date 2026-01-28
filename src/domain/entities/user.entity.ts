export enum UserRole {
  ADMIN = 'ADMIN', // System administrator (SaaS owner)
  OWNER = 'OWNER', // Tenant owner (The one who pays)
  MANAGER = 'MANAGER', // Tenant manager
  USER = 'USER' // Standard tenant user
}

export interface IUser {
  id?: string;
  username: string;
  email: string;
  document: string; // CPF or CNPJ
  password?: string;
  active: boolean;
  roles: UserRole[];
  resetLink?: string;
  payment_account_id?: string;
  verification_code?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
