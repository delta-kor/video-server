import { Model, model, Schema } from 'mongoose';
import generateId from '../../utils/id.util';
import TokenUtil from '../../utils/token.util';
import UserPlaylist from '../playlist/interface/user-playlist.interface';
import UserPlaylistModel from '../playlist/model/user-playlist.model';
import Video from '../video/video.interface';
import VideoModel from '../video/video.model';
import User, { Role, UserInfo } from './user.interface';

interface UserModel extends Model<User> {
  nicknameExists(nickname: string): Promise<boolean>;
}

const UserSchema = new Schema<User, UserModel>(
  {
    id: { type: String, required: true, unique: true, default: () => generateId(8) },
    nickname: { type: String, required: true, unique: true },
    role: { type: Number, required: true },
    ip: { type: [String], required: true },
    ban_info: { type: Schema.Types.Mixed, required: true, default: () => ({ banned: false }) },
    last_active: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

UserSchema.methods.getLikedVideos = async function (this: User): Promise<Video[]> {
  return VideoModel.find({ liked: this.id });
};

UserSchema.methods.getUserPlaylists = async function (this: User): Promise<UserPlaylist[]> {
  return UserPlaylistModel.find({ user_id: this.id });
};

UserSchema.methods.updateActive = async function (this: User): Promise<void> {
  try {
    this.last_active = new Date();
    await this.save();
  } catch (e) {
    console.error(e);
  }
};

UserSchema.methods.addIp = async function (this: User, ip: string): Promise<void> {
  if (!this.ip.includes(ip)) {
    this.ip.push(ip);
    await this.save();
  }
};

UserSchema.methods.createToken = function (this: User): string {
  return TokenUtil.create(this);
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
