import { Document } from 'mongoose';

interface Scoreboard {
  [key: string]: number;
}

interface CampdUser extends Document {
  id: string;
  scoreboard: Scoreboard;
  exp: number;
}

export { Scoreboard };
export default CampdUser;
