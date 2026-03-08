import { getNowBRToMongo } from '@/shared/utils/helper';

export const schemaOptions = {
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

export const defaultDates = {
  createdAt: { type: Date, default: getNowBRToMongo() },
  updatedAt: { type: Date, default: getNowBRToMongo() }
};
