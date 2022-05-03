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
}

export { Role };
export default User;
