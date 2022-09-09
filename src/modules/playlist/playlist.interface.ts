import { Request } from 'express';
import { Document } from 'mongoose';
import { VideoType } from '../video/video.interface';

interface Playlist extends Document {
  id: string;
  label: string;
  type: VideoType;
  title: Locales;
  description: Locales;
  video: string[];
  featured: boolean;
  order: number;
  thumbnail: string;
  image?: string;
  count: number;

  serialize(req: Request, ...keys: (keyof Playlist)[]): Playlist;
}

export default Playlist;
