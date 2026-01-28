import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { IUser } from '@/domain/entities/user.entity';
import { UserModel } from '../database/mongoose-schemas';

export class MongooseUserRepository implements IUserRepository {
  async create(user: Partial<IUser>): Promise<IUser> {
    const created = await UserModel.create(user);
    return created.toObject();
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id);
    return user ? user.toObject() : null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email });
    return user ? user.toObject() : null;
  }

  async findByVerificationCode(code: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ verification_code: code });
    return user ? user.toObject() : null;
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    const updated = await UserModel.findByIdAndUpdate(id, user, { new: true });
    return updated ? updated.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  async list(filters: any): Promise<IUser[]> {
    const users = await UserModel.find(filters);
    return users.map((u) => u.toObject());
  }
}
