import { Request } from 'express';
import { model, Schema } from 'mongoose';
import ServiceProvider from '../../../services/provider.service';
import generateId from '../../../utils/id.util';
import Video from '../../video/video.interface';
import VideoService from '../../video/video.service';
import Playlist from '../interface/playlist.interface';
import UserPlaylist from '../interface/user-playlist.interface';
import PlaylistModel from './playlist.model';

const UserPlaylistSchema = new Schema({
  id: { type: String, required: true, unique: true, default: () => generateId(10) },
  user_id: { type: String, required: true },
  type: { type: String, required: true, default: 'user' },
  title: { type: String, required: true },
  video: { type: [String], required: true },
});

UserPlaylistSchema.virtual('thumbnail').get(function (this: UserPlaylist): string {
  return this.video[0];
});

UserPlaylistSchema.virtual('count').get(function (this: UserPlaylist): number {
  return this.video.length;
});

UserPlaylistSchema.methods.serialize = function (
  this: UserPlaylist,
  req: Request,
  ...keys: (keyof UserPlaylist)[]
): Playlist {
  const result: any = {};
  for (const key of keys) {
    if (key === 'video') {
      const videoService: VideoService = ServiceProvider.get(VideoService);

      const videos: Video[] = [];
      for (const videoId of this.video) {
        const video = videoService.get(videoId);
        if (!video) continue;

        const serializedVideo = video.serialize(req, 'id', 'title', 'description', 'duration', 'properties');
        videos.push(serializedVideo);
      }

      result.video = videos;
      continue;
    }

    let value: any = this[key];
    if (value instanceof Date) value = value.getTime();

    result[key] = value;
  }

  return result;
};

UserPlaylistSchema.methods.toPlaylist = function (this: UserPlaylist): Playlist {
  return new PlaylistModel({
    id: this.id,
    label: this.id,
    type: 'user',
    title: this.title,
    description: this.title,
    video: this.video,
    featured: false,
    order: -1,
  });
};

const UserPlaylistModel = model<UserPlaylist>('user-playlist', UserPlaylistSchema);

export default UserPlaylistModel;
