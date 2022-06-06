import { Document } from 'mongoose';

type VideoOptions = 'music' | 'category' | 'recommend';

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

  options: VideoOptions[];

  hasOption(option: VideoOptions): boolean;
}

export { VideoOptions };
export default Video;
