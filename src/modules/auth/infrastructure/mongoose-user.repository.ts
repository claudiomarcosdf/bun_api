import { IUserRepository } from '@/modules/auth/infrastructure/interface/user.repository';
import { IUser } from '@/modules/auth/domain/user.entity';
import { UserModel } from '@/infrastructure/database/schemas';
import { getNowBRToMongo } from '@/shared/utils/helper';

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
    const user = await UserModel.findOne({ verificationCode: code });
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

  async getUserAndPaymentAccountById(id: string): Promise<any | null> {
    const user = await UserModel.findById(id).populate('paymentAccountId');
    return user ? user.toObject() : null;
  }

  async addUserRole(id: string, role: string): Promise<IUser | null> {
    const updatedAt = getNowBRToMongo();
    const updated = await UserModel.findByIdAndUpdate(
      id,
      {
        $addToSet: { roles: role }, // Adiciona apenas se não existir
        $set: { updatedAt }
      },
      { new: true }
    );
    return updated ? updated.toObject() : null;
  }

  async removeUserRole(id: string, role: string): Promise<IUser | null> {
    const updatedAt = getNowBRToMongo();
    const updated = await UserModel.findByIdAndUpdate(
      id,
      {
        $pull: { roles: role }, // Remove o role do array
        $set: { updatedAt }
      },
      { new: true }
    );
    return updated ? updated.toObject() : null;
  }
}
