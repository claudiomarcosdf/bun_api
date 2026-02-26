import mongoose, { Schema, Document } from 'mongoose';
import { IUser, UserRole } from '@/domain/entities/user.entity';
import { IPaymentAccount } from '@/domain/entities/payment-account.entity';
import { getNowBRToMongo } from '@/shared/utils/helper';

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
    tenantId: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // For multi-tenancy support
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
    resetPasswordToken: { type: String, nullable: true },
    verificationCode: { type: String, nullable: true },
    paymentAccountId: { type: Schema.Types.ObjectId, ref: 'PaymentAccount' },
    createdAt: { type: Date, default: getNowBRToMongo() }, // Default apenas para createdAt
    updatedAt: { type: Date, default: getNowBRToMongo() }
  },
  {
    ...schemaOptions,
    timestamps: false
  }
);

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
    createdAt: { type: Date, default: getNowBRToMongo() }, // Default apenas para createdAt
    updatedAt: { type: Date, default: getNowBRToMongo() } // Default para updatedAt, mas será atualizado manualmente no código para refletir o timezone correto
  },
  {
    ...schemaOptions,
    timestamps: false
  }
);

UserSchema.virtual('paymentAccount', {
  ref: 'PaymentAccount',
  localField: 'paymentAccountId',
  foreignField: 'id',
  justOne: true
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

export const PaymentAccountModel = mongoose.model<IPaymentAccountDocument>('PaymentAccount', PaymentAccountSchema);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
