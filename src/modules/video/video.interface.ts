import { Request } from 'express';
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
  subtitle?: string;

  duration: number; // virtual
  is_4k: boolean; // virtual
  is_cc: boolean; // virtual
  tags: string[]; // virtual
  options: VideoOptions[];
  liked: string[];

  hasOption(option: VideoOptions): boolean;
  serialize(req: Request, ...keys: (keyof Video)[]): Video;
}

export { VideoOptions, VideoType };
export default Video;
