import mongoose, { Schema, Document } from 'mongoose';
import { schemaOptions, defaultDates } from '@/infrastructure/database/schemas/schema-options';
import { IPaymentAccount } from '../domain/payment-account.entity';

export interface IPaymentAccountDocument extends IPaymentAccount, Document {}

const PaymentAccountSchema = new Schema<IPaymentAccountDocument>(
  {
    cellphone: { type: String },
    plan: { type: String, default: 'FREE' },
    stripeCustomerId: { type: String },
    stripePriceId: { type: String },
    stripeSubscriptionId: { type: String },
    stripeSubscriptionStatus: { type: String },
    currentPeriodStart: { type: Number },
    unitAmount: { type: Number },
    ...defaultDates
  },
  {
    ...schemaOptions,
    timestamps: false
  }
);

export const PaymentAccountModel = mongoose.model<IPaymentAccountDocument>('PaymentAccount', PaymentAccountSchema);
