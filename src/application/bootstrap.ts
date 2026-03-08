import mongoose from 'mongoose';
import { Logger } from '../core/logger/logger';
import { env } from '../core/config/env';

export async function bootstrap() {
  try {
    await mongoose.connect(env.DATABASE_URL || 'mongodb://localhost:27017/api_bun');

    Logger.info('Connected to MongoDB 🍃');
  } catch (error) {
    Logger.error('MongoDB connection error', error);
    process.exit(1);
  }
}
