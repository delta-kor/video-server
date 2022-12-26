import { Request } from 'express';
import { Document } from 'mongoose';

type VideoOption = 'music' | 'category' | 'recommend' | 'fanchant';
type VideoType = 'performance' | 'vod';
type VideoProperty = '4k' | 'cc';

interface Video extends Document {
  id: string;
  cdnId: string;
  cdnId_4k?: string;

  type: VideoType;
  title: string;
  description: string;
  date: Date;
  category: [string, string, string];
  subtitle?: string;

  duration: number; // virtual
  properties: VideoProperty[]; // virtual
  tags: string[]; // virtual
  options: VideoOption[];
  liked: string[];

  hasOption(option: VideoOption): boolean;
  serialize(req: Request, ...keys: (keyof Video)[]): Video;
}

export { VideoOption, VideoType, VideoProperty };
export default Video;
