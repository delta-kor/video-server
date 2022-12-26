import { Request } from 'express';
import { Document } from 'mongoose';
import Playlist from './playlist.interface';

interface UserPlaylist extends Document {
  id: string;
  user_id: string;
  title: string;
  video: string[];

  count: number;
  thumbnail: string;

  serialize(req: Request, ...keys: (keyof Playlist)[]): Playlist;
  toPlaylist(nickname: string): Playlist;
}

export default UserPlaylist;
