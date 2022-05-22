import { Document } from 'mongoose';

interface Video extends Document {
  id: string;
  cdnId: string;
  cdnId_4k: string;
  title: string;
  description: string;
  date: Date;
  category: [string, string, string];

  duration: number;
  is_4k: boolean;

  private: boolean;
}

export default Video;
