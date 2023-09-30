import { Document } from 'mongoose';
import { CampdGameInput, CampdGameResult } from './campd-game.interface';

interface CampdRecord extends Document {
  token: string;
  user_id: string;
  input: CampdGameInput;
  result: CampdGameResult;
}

export default CampdRecord;
