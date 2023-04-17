import { Document } from 'mongoose';

type ScoreType = 'group' | 'solo';
type CameraType = 'group' | 'perfect' | 'in' | 'out';

interface ScoreData {
  type: ScoreType;
  cameras: CameraType[];
}

interface Timesheet {
  [key: number]: ScoreData;
}

interface Scoresheet {
  group_index: number;
  solo_index: number[];

  score_group_focused: number;
  score_group_default: number;
  score_solo_perfect_focused: number;
  score_solo_perfect_default: number;
  score_solo_in_focused: number;
  score_solo_in_default: number;
  score_solo_out_focused: number;
  score_solo_out_default: number;

  ratio: number;

  timesheet: Timesheet;
}

interface CampdVideo extends Document {
  id: string;
  title: string;
  description: string;
  cdn_id: string;
  duration: number;
  scoresheet: Scoresheet;
}

export { ScoreType, CameraType, ScoreData, Timesheet };
export default CampdVideo;
