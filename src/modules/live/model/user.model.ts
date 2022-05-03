import { model, Schema } from 'mongoose';
import generateId from '../../../utils/id.util';
import User from '../interface/user.interface';

const UserSchema = new Schema<User>({
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

const UserModel = model<User>('user', UserSchema);

export default UserModel;
