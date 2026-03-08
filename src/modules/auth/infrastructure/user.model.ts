import mongoose, { Schema, Document } from 'mongoose';
import { IUser, UserRole } from '@/modules/auth/domain/user.entity';
import { schemaOptions, defaultDates } from '@/infrastructure/database/schemas/schema-options';

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'User', default: null },

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

    ...defaultDates
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

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
