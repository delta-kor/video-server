import { Document } from 'mongoose';

interface Video extends Document {
  id: string;
  cdn_id: string;
  title: string;
  date: Date;
  details_ko: string;
  details_en: string;
}

export default Video;
