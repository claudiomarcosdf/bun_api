export interface IPaymentAccount {
  id?: string;
  cellphone?: string;
  plan?: string;
  stripe_customer_id?: string;
  stripe_price_id?: string;
  stripe_subscription_id?: string;
  stripe_subscription_status?: string;
  current_period_start?: number;
  unit_amount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
