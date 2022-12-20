import { Request } from 'express';
import Playlist from './playlist.interface';

interface UserPlaylist {
  id: string;
  user_id: string;
  title: string;
  video: string[];

  count: number;
  thumbnail: string;

  serialize(req: Request, ...keys: (keyof Playlist)[]): Playlist;
}

export default UserPlaylist;
