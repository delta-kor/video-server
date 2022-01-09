import { Document } from 'mongoose';

interface Video extends Document {
  id: string;
  cdnId: string;
  title: string;
  description: string;
  date: Date;
  category: [string, string, string];

  duration: number;
}

export default Video;
