import { Request } from 'express';
import { Document, Model } from 'mongoose';
import Video, { VideoType } from '../../video/video.interface';

interface PlaylistModel extends Model<Playlist> {
  createLikedPlaylist(videos: Video[]): Playlist;
}

interface Playlist extends Document {
  id: string;
  label: string;
  type: VideoType;
  title: Locales;
  description: Locales;
  video: string[];
  featured: boolean;
  order: number;
  image?: string;

  thumbnail: string;
  count: number;

  serialize(req: Request, ...keys: (keyof Playlist)[]): Playlist;
}

export { PlaylistModel };
export default Playlist;
