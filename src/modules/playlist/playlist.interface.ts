import { Document } from 'mongoose';
import { VideoType } from '../video/video.interface';

interface Playlist extends Document {
  id: string;
  label: string;
  type: VideoType;
  title: string;
  description: string;
  video: string[];
  featured: boolean;
  order: number;

  serialize(...keys: (keyof Playlist)[]): Playlist;
}

export default Playlist;
