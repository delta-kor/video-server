import { Request } from 'express';
import { Document } from 'mongoose';

type VideoOption = 'music' | 'category' | 'recommend' | 'fanchant';
type VideoType = 'performance' | 'vod';
type VideoProperty = '4k' | 'cc';

interface Teleport {
  from: number;
  to: number;
}

interface Chapter {
  title: Locales;
  time: number;
}

interface Timeline {
  teleports: Teleport[];
  chapters: Chapter[];
}

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
  timeline?: Timeline;

  duration: number; // virtual
  properties: VideoProperty[]; // virtual
  tags: string[]; // virtual
  options: VideoOption[];

  hasOption(option: VideoOption): boolean;
  getLiked(): Promise<string[]>;
  serialize(req: Request, ...keys: (keyof Video)[]): Video;
}

export { VideoOption, VideoType, VideoProperty, Teleport, Chapter, Timeline };
export default Video;
