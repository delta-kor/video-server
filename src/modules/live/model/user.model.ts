import { Model, model, Schema } from 'mongoose';
import generateId from '../../../utils/id.util';
import User from '../interface/user.interface';

interface UserModel extends Model<User> {
  nicknameExists(nickname: string): Promise<boolean>;
}

const UserSchema = new Schema<User, UserModel>({
  id: { type: String, required: true, unique: true, default: () => generateId(8) },
  nickname: { type: String, required: true, unique: true },
  role: { type: Number, required: true },
  ip: { type: [String], required: true },
});

UserSchema.methods.addIp = async function (this: User, ip: string): Promise<void> {
  if (!this.ip.includes(ip)) {
    this.ip.push(ip);
    await this.save();
  }
};

UserSchema.statics.nicknameExists = async function (this: UserModel, nickname: string): Promise<boolean> {
  return this.exists({ nickname });
};

const UserModel = model<User, UserModel>('user', UserSchema);

export default UserModel;