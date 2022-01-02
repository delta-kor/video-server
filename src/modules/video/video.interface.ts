import { Document } from 'mongoose';

interface Video extends Document {
  id: string;
  cdnId: string;
  title: string;
  date: Date;
  category: string;
  details: string;
}

export default Video;
