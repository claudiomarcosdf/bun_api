export interface ResolvedSubscription {
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripeSubscriptionStatus: string;
  plan: string;
  stripePriceId: string;
  unitAmount: number | null;
  currentPeriodStart: number;
}
