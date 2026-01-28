import { IUser } from '../entities/user.entity';

export interface IUserRepository {
  create(user: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByVerificationCode(code: string): Promise<IUser | null>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
  list(filters: any): Promise<IUser[]>;
}

export interface ITenantRepository {
  create(tenant: any): Promise<any>;
  findById(id: string): Promise<any>;
  findBySlug(slug: string): Promise<any>;
  update(id: string, tenant: any): Promise<any>;
}
