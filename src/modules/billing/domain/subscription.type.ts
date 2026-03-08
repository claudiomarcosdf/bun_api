export interface ResolvedSubscription {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripeSubscriptionStatus: string;
  plan: string;
  stripePriceId: string;
  unitAmount: number | null;
  currentPeriodStart: number;
}
