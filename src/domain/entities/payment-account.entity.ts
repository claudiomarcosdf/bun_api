export interface IPaymentAccount {
  id?: string;
  cellphone?: string;
  plan?: string;
  stripeCustomerId?: string;
  stripePriceId?: string;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: string;
  currentPeriodStart?: number;
  unitAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
