import { model, Schema } from 'mongoose';
import User from '../interface/user.interface';

const UserSchema = new Schema<User>({
  id: { type: String, required: true, unique: true },
  nickname: { type: String, required: true, unique: true },
  role: { type: Number, required: true },
  ip: { type: [String], required: true },
});

const UserModel = model<User>('user', UserSchema);

export default UserModel;
