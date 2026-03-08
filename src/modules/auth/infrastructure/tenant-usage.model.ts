import mongoose, { Schema, Document } from 'mongoose';
import { ITenantUsage } from '@/modules/auth/domain/tenant-usage.entity';
import { schemaOptions } from '@/infrastructure/database/schemas/schema-options';

export interface ITenantUsageDocument extends ITenantUsage, Document {}

const TenantUsageSchema = new Schema<ITenantUsageDocument>(
  {
    tenantId: {
      type: String,
      required: true,
      unique: true
    },

    usage: {
      products: { type: Number, default: 0 },
      sales: { type: Number, default: 0 }
    }
  },
  {
    ...schemaOptions
  }
);

export const TenantUsageModel = mongoose.model<ITenantUsageDocument>('TenantUsage', TenantUsageSchema);
