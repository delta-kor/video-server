import { Document } from 'mongoose';

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

  addIp(ip: string): Promise<void>;
  createToken(): string;
  info(): UserInfo;
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
