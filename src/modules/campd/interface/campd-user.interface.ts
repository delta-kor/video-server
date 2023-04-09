import { Document } from 'mongoose';

interface Scoreboard {
  [key: string]: number;
}

interface CampdUser extends Document {
  id: string;
  scoreboard: Scoreboard;
}

export { Scoreboard };
export default CampdUser;
