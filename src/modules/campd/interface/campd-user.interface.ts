import { Document } from 'mongoose';

interface Scoreboard {
  [key: string]: number;
}

interface CampdRank {
  id: string;
  nickname: string;
  score: number;
  rank: number;
}

interface CampdUser extends Document {
  id: string;
  scoreboard: Scoreboard;
  exp: number;
}

export { Scoreboard, CampdRank };
export default CampdUser;
