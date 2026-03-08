export interface IUsage {
  products: number;
  sales: number;
}

export interface ITenantUsage {
  tenantId: string;
  usage: IUsage;
  createdAt: Date;
  updatedAt: Date;
}
