import { Document } from 'mongoose';

type VideoOptions = 'music' | 'category' | 'recommend' | 'fanchant';
type VideoType = 'performance' | 'vod';

interface Video extends Document {
  id: string;
  cdnId: string;
  cdnId_4k?: string;

  type: VideoType;
  title: string;
  description: string;
  date: Date;
  category: [string, string, string];

  duration: number;
  is_4k: boolean;

  options: VideoOptions[];
  hasOption(option: VideoOptions): boolean;

  tags: string[];

  serialize(...keys: (keyof Video)[]): Video;
}

export { VideoOptions, VideoType };
export default Video;
