import crypto from 'crypto';
import { Model, model, Schema } from 'mongoose';
import generateId from '../../utils/id.util';
import User, { Role, UserInfo } from './user.interface';

interface UserModel extends Model<User> {
  nicknameExists(nickname: string): Promise<boolean>;
}

const UserSchema = new Schema<User, UserModel>({
  id: { type: String, required: true, unique: true, default: () => generateId(8) },
  nickname: { type: String, required: true, unique: true },
  role: { type: Number, required: true },
  ip: { type: [String], required: true },
  ban_info: { type: Schema.Types.Mixed, required: true, default: () => ({ banned: false }) },
});

UserSchema.methods.addIp = async function (this: User, ip: string): Promise<void> {
  if (!this.ip.includes(ip)) {
    this.ip.push(ip);
    await this.save();
  }
};

UserSchema.methods.createToken = function (this: User): string {
  const id = this.id;
  const secret = process.env.SECRET_KEY as string;
  const hash = crypto.createHash('md5').update(id).update(secret).digest('hex');
  return `${id}.${hash}`;
};

UserSchema.methods.info = function (this: User): UserInfo {
  return { id: this.id, nickname: this.nickname, role: this.role };
};

UserSchema.methods.isStaff = function (this: User): boolean {
  return this.role === Role.STAFF || this.role === Role.MASTER;
};

UserSchema.methods.serialize = function (this: User, ...keys: (keyof User)[]): User {
  const result: any = {};
  for (const key of keys) {
    let value: any = this[key];
    if (value instanceof Date) value = value.getTime();

    result[key] = value;
  }

  return result;
};

UserSchema.statics.nicknameExists = async function (this: UserModel, nickname: string): Promise<boolean> {
  return this.exists({ nickname });
};

const UserModel = model<User, UserModel>('user', UserSchema);

export default UserModel;
