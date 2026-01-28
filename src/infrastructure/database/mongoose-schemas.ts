import mongoose, { Schema, Document } from 'mongoose';
import { IUser, UserRole } from '@/domain/entities/user.entity';
import { IPaymentAccount } from '@/domain/entities/payment-account.entity';

export interface IUserDocument extends IUser, Document {}
export interface IPaymentAccountDocument extends IPaymentAccount, Document {}

// Configuração global para transformar _id em id ao converter para JSON ou Objeto
const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  }
};

const UserSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    document: { type: String, required: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: false },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.USER]
    },
    resetLink: { type: String },
    verification_code: { type: String },
    payment_account_id: { type: Schema.Types.ObjectId, ref: 'PaymentAccount' }
  },
  schemaOptions
);

const PaymentAccountSchema = new Schema<IPaymentAccountDocument>(
  {
    cellphone: { type: String },
    plan: { type: String, default: 'FREE' },
    stripe_customer_id: { type: String },
    stripe_price_id: { type: String },
    stripe_subscription_id: { type: String },
    stripe_subscription_status: { type: String },
    current_period_start: { type: Number },
    unit_amount: { type: Number }
  },
  schemaOptions
);

export const PaymentAccountModel = mongoose.model<IPaymentAccountDocument>('PaymentAccount', PaymentAccountSchema);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
