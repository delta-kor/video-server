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

  addIp(ip: string): Promise<void>;
}

interface UserInfo {
  id: string;
  nickname: string;
  role: Role;
}

export { Role, UserInfo };
export default User;
