import { Document } from 'mongoose';
import UserPlaylist from '../playlist/interface/user-playlist.interface';
import Video from '../video/video.interface';

enum Role {
  USER,
  STAFF,
  MASTER,
}

interface User extends Document {
  id: string;
  nickname: string;
  role: Role;
  ip: string[];
  ban_info: BanInfo;
  last_active: Date;
  liked: string[];

  getLikedVideos(): Promise<Video[]>;
  getUserPlaylists(): Promise<UserPlaylist[]>;
  updateActive(ip: string): Promise<void>;

  addIp(ip: string): Promise<void>;
  createToken(): string;
  info(): UserInfo;
  isStaff(): boolean;

  serialize(...keys: (keyof User)[]): User;
}

interface UserInfo {
  id: string;
  nickname: string;
  role: Role;
}

type BanInfo = DefaultBanInfo | ProceedingBanInfo;

interface DefaultBanInfo {
  banned: false;
}

interface ProceedingBanInfo {
  banned: true;
  until: Date;
  reason: string;
}

export { Role, UserInfo };
export default User;
